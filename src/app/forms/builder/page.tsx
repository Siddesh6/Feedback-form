'use client';

import { AdminLayout } from "@/components/layout/admin-layout";
import dynamic from "next/dynamic";

const FormBuilder = dynamic(
    () => import('@/components/forms/form-builder').then((mod) => mod.FormBuilder),
    { 
        ssr: false,
        loading: () => (
            <div className="space-y-4">
                <div className="h-48 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-48 w-full animate-pulse rounded-md bg-muted"></div>
            </div>
        )
    }
);

export default function FormBuilderPage() {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline">Form Editor</h1>
                <p className="text-muted-foreground mt-1">
                    You are editing "My Custom Form". Changes are reflected in the preview and on the shareable form page.
                </p>
            </div>
            <div className="mt-6">
                <FormBuilder />
            </div>
        </AdminLayout>
    )
}
