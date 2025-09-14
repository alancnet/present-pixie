import { Button } from '@heroui/react'

function App() {
  return (
    <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold">Welcome to your app</h1>
        <p className="text-default-500 text-base md:text-lg">
          Replace this with a marketing homepage. Tailwind v4 and HeroUI are configured.
        </p>
        <div className="flex gap-3 justify-center">
          <Button color="primary">Get Started</Button>
          <Button variant="bordered">Learn More</Button>
        </div>
      </div>
    </div>
  )
}

export default App
