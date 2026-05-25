// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 pt-16">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#6366f1",
          },
        }}
      />
    </div>
  );
}
