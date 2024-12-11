import MainNav from "@/components/layout/MainNav";
function HomePage() {
    return (
        <>
            <MainNav />
            <main className="mx-auto max-w-7xl pt-[calc(5rem-1px)]">
                <div className="border px-6 pb-6 pt-40">
                    <h1 className="text-5xl font-medium tracking-tight">
                        Vinyl Vibe
                    </h1>
                </div>
                {/* Featured products will go here */}
            </main>
        </>
    );
}

export default HomePage;
