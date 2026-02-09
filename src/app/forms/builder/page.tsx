import { AdminLayout } from "@/components/layout/admin-layout";
import { FormBuilder } from "@/components/forms/form-builder";

export default function FormBuilderPage() {
    return (
        <AdminLayout>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight font-headline">Form Builder</h1>
            </div>
            <FormBuilder />
        </AdminLayout>
    )
}