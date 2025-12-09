import { PasswordResetForm } from "@/components/auth/password-reset-form";

export default function PasswordResetPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : undefined;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <PasswordResetForm token={token} />
    </div>
  );
}