// app/apps/[id]/page.tsx
import { Header } from "@/components/shared/header/Header";
import { HeaderAppCard } from "@/components/shared/appPage/HeaderAppCard";
import { AppInfo } from "@/components/shared/appPage/AppInfo";
import { AppActions } from "@/components/shared/appPage/AppActions";
import { AppScreenshots } from "@/components/shared/appPage/AppScreenshots";
import { AppReviews } from "@/components/shared/appPage/AppReviews";
import { MoreFromDeveloper } from "@/components/shared/appPage/MoreFromDeveloper";

interface Props {
    params: { id: string };
}

// Функция для получения данных приложения (серверная)
async function getAppData(appId: number) {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

        const [appRes, categoriesRes] = await Promise.all([
            fetch(`${API_URL}/apps/${appId}`, {
                cache: 'force-cache', // Кэшируем запрос
                next: { revalidate: 60 } // Ревалидация каждые 60 секунд
            }),
            fetch(`${API_URL}/categories`, {
                cache: 'force-cache',
                next: { revalidate: 300 } // Категории реже меняются
            })
        ]);

        if (!appRes.ok) {
            throw new Error('Приложение не найдено');
        }

        const app = await appRes.json();
        const categories = await categoriesRes.json();

        return {
            app,
            category: categories.find((c: any) => c.id === app.category_id)
        };
    } catch (error) {
        console.error('Error fetching app data:', error);
        return null;
    }
}

export default async function AppPage({ params }: Props) {
    const appId = parseInt(params.id);

    if (isNaN(appId)) {
        return (
            <div className="min-h-screen mt-16 bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Неверный ID приложения
                        </h1>
                        <p className="text-muted-foreground">
                            Пожалуйста, проверьте ссылку и попробуйте снова
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const data = await getAppData(appId);

    if (!data) {
        return (
            <div className="min-h-screen mt-16 bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Приложение не найдено
                        </h1>
                        <p className="text-muted-foreground">
                            Запрошенное приложение не существует или было удалено
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const { app, category } = data;

    return (
        <div className="min-h-screen mt-16 bg-background">
            <Header />
            <HeaderAppCard
                label={app.name}
                shortDesc={app.short_descr}
            />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <AppInfo
                    icon={app.url}
                    name={app.name}
                    developer="LowTabCoders"
                    category={category?.name || "Без категории"}
                    downloads={`${app.downloads.toLocaleString()}+`}
                />
                <AppActions app={app} />
                <AppScreenshots />
                <AppReviews appId={app.id} />
                <MoreFromDeveloper developerId={1} />
            </div>
        </div>
    );
}

// Генерация статических параметров для лучшей производительности
export async function generateStaticParams() {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${API_URL}/apps`, {
            cache: 'force-cache'
        });

        if (!res.ok) {
            return [];
        }

        const apps = await res.json();

        return apps.slice(0, 10).map((app: any) => ({
            id: app.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Метаданные для SEO
export async function generateMetadata({ params }: Props) {
    const appId = parseInt(params.id);
    const data = await getAppData(appId);

    if (!data) {
        return {
            title: 'Приложение не найдено - LowTabCoders',
            description: 'Запрошенное приложение не существует',
        };
    }

    const { app } = data;

    return {
        title: `${app.name} - LowTabCoders`,
        description: app.short_descr,
        openGraph: {
            title: app.name,
            description: app.short_descr,
            type: 'website',
        },
    };
}