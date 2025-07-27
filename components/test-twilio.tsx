"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestTwilio() {
  const [phoneNumber, setPhoneNumber] = useState("+1234567890"); // Default test number
  const [message, setMessage] = useState("Hello from KeepMeHonest test!");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testEndpoint = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch("https://wfslmquvqxfesousywdy.supabase.co/functions/v1/test-twilio-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Twilio SMS Endpoint</CardTitle>
        <CardDescription>
          Test your Supabase Edge Function for sending SMS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
          />
        </div>
        
        <div>
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Test message"
          />
        </div>

        <Button 
          onClick={testEndpoint} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test SMS Endpoint"}
        </Button>

        {response && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800 mb-2">Success Response:</h4>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">{response}</pre>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-800 mb-2">Error Response:</h4>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}