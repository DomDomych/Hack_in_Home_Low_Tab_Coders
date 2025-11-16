import "./globals.css";
import {ThemeProvider} from "@/components/shared/ThemeProvider";
import { AuthProvider } from '@/hooks/useAuth'

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode;
    }) {



    return (
        <html lang="ru" suppressHydrationWarning>
        <body className="[&_*]:focus-visible:outline-ring/50">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark", "system"]}
        >
            <AuthProvider>
                <main className="min-h-screen">{children}</main>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}