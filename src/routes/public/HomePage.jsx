import MainNav from '../../components/layout/MainNav'

function HomePage() {
  return (
    <div>
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold">Welcome to Vinyl Vibe</h1>
        <p className="mt-4 text-xl">Discover your next favorite record.</p>
        {/* Featured products will go here */}
      </main>
    </div>
  )
}

export default HomePage 