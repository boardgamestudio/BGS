import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function ManageGroups() {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
            <CardTitle className="text-white">Manage Your Groups</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-lg font-medium text-white">Group Management Coming Soon</h3>
                <p className="mt-1 text-sm text-slate-400">This feature is under development. Stay tuned!</p>
            </div>
        </CardContent>
    </Card>
  );
}