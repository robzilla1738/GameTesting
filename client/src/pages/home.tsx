import { motion } from "framer-motion";
import { GameGrid } from "@/components/games/game-grid";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Play, Upload, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 overflow-hidden bg-gradient-animated">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Developer-First Game Platform</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
            >
              The Ultimate Game{" "}
              <span className="text-primary">Hosting Platform</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Host your HTML5 games for free, build your community, and monetize
              your creations without platform fees.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center mt-10"
            >
              <Link href="/games">
                <Button size="lg" className="button-glow">
                  <Play className="mr-2 h-5 w-5" />
                  Browse Games
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="button-glow">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your Game
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-1/2 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl transform -translate-y-1/2" />
      </section>

      {/* Trending Games */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Trending Games
            </motion.h2>
            <Link href="/games">
              <Button variant="ghost" className="button-glow">View All</Button>
            </Link>
          </div>
          <GameGrid />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10"
          >
            Why Choose GameHost?
          </motion.h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Zero Platform Fees",
                description:
                  "Keep 100% of your revenue. Add your own monetization methods.",
                icon: "💰"
              },
              {
                title: "Developer-First",
                description:
                  "Built for developers with version control and analytics.",
                icon: "👨‍💻"
              },
              {
                title: "Growing Community",
                description:
                  "Connect with players and other developers in real-time.",
                icon: "🌍"
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 rounded-lg hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}