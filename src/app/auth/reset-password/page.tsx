
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage({
  searchParams
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token || ""
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
