import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  return (
    <div className="h-full bg-gray-100">
      <PageHeader title="Settings" />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          <p className="text-gray-600">Configure your account preferences.</p>
        </div>
      </div>
    </div>
  );
}
