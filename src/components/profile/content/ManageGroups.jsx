import React from 'react';
import { Users } from 'lucide-react';

export default function ManageGroups() {
    return (
        <div className="text-center py-12 border border-dashed border-border-default rounded-lg">
            <Users className="w-12 h-12 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-main">Group Management is Coming Soon!</h3>
            <p className="text-text-muted mt-2">Create and manage your own communities and interest groups.</p>
        </div>
    );
}