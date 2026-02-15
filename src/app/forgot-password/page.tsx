'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
      toast({
        title: 'Password Reset Email Sent',
        description: 'If an account exists for this email, a password reset link has been sent.',
      });
    } catch (err: any) {
      console.error(err);
      // We still show success to prevent email enumeration
      setSubmitted(true);
       toast({
        title: 'Password Reset Email Sent',
        description: 'If an account exists for this email, a password reset link has been sent.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center font-headline">Forgot Password</CardTitle>
          {submitted ? (
            <CardDescription className="text-center pt-2">
              Please check your inbox for a password reset link.
            </CardDescription>
          ) : (
            <CardDescription className="text-center">
              Enter your email to receive a password reset link.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {submitted ? (
             <div className="text-center">
                <Button asChild>
                    <Link href="/login">Return to Login</Link>
                </Button>
             </div>
          ) : (
            <form onSubmit={handleResetPassword} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
              </Button>
            </form>
          )}
           <div className="mt-4 text-center text-sm">
            Remembered your password?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
