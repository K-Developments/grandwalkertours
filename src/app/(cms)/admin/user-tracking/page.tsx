// src/app/(cms)/admin/user-tracking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCookieConsentLogs } from '@/lib/firebase/firestore';
import type { CookieConsentLog } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function UserTrackingPage() {
  const [logs, setLogs] = useState<CookieConsentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getCookieConsentLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">User Tracking</CardTitle>
          <CardDescription>
            This page shows a log of users who have consented to cookies for analytics purposes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No cookie consent logs found yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consent ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>
                      {format(log.consentedAt.toDate(), 'PPP p')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
