import { UserAuthContextProvider } from "./Auth/auth-context";


export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserAuthContextProvider>
      {children}
    </UserAuthContextProvider>
  );
}