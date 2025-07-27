-- Table: goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text not null,
  reasons text[] default '{}',
  created_at timestamp default now(),
  updated_at timestamp default now(),
  is_active boolean default true
);

-- Migration: Add updated_at column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'updated_at') THEN
        ALTER TABLE goals ADD COLUMN updated_at timestamp default now();
    END IF;
END $$;

-- Migration: Add reasons column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'reasons') THEN
        ALTER TABLE goals ADD COLUMN reasons text[] default '{}';
    END IF;
END $$;

-- Migration: Add times columns for goals (up to 3 times per day)
DO $$ 
BEGIN
    -- Add time1 column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'time1') THEN
        ALTER TABLE goals ADD COLUMN time1 time;
    END IF;
    
    -- Add time2 column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'time2') THEN
        ALTER TABLE goals ADD COLUMN time2 time;
    END IF;
    
    -- Add time3 column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goals' AND column_name = 'time3') THEN
        ALTER TABLE goals ADD COLUMN time3 time;
    END IF;
END $$;

-- Table: checkins
create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  goal_id uuid references goals(id) on delete cascade,
  checked_on date not null,
  created_at timestamp default now(),
  constraint unique_checkin_per_day unique (user_id, goal_id, checked_on)
);
-- Enable Row Level Security
alter table goals enable row level security;

-- Create policy to allow users to see only their own goals
create policy "Users can view their own goals" on goals
  for select using (auth.uid() = user_id);

-- Create policy to allow users to insert their own goals
create policy "Users can insert their own goals" on goals
  for insert with check (auth.uid() = user_id);

-- Create policy to allow users to update their own goals
create policy "Users can update their own goals" on goals
  for update using (auth.uid() = user_id);

-- Create policy to allow users to delete their own goals
create policy "Users can delete their own goals" on goals
  for delete using (auth.uid() = user_id);


-- Enable Row Level Security for the checkins table
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to see only their own check-ins
CREATE POLICY "Users can view their own check-ins" ON checkins
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy to allow users to insert their own check-ins
CREATE POLICY "Users can insert their own check-ins" ON checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow users to update their own check-ins
CREATE POLICY "Users can update their own check-ins" ON checkins
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy to allow users to delete their own check-ins
CREATE POLICY "Users can delete their own check-ins" ON checkins
  FOR DELETE USING (auth.uid() = user_id);

-- Create an index on user_id and goal_id for better query performance
CREATE INDEX checkins_user_id_goal_id_idx ON checkins(user_id, goal_id);

-- Create a trigger to update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_goals_updated_at
  before update on goals
  for each row
  execute function update_updated_at_column();