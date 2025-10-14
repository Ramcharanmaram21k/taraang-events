"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
    return (
        <section
            id="home"
            className="relative flex items-center justify-center h-[calc(100vh-4rem)] w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#95ceff] via-[#bb74fb] to-[#fc2994]"
        >
            {/* The diagonal "stripe" effect using absolutely positioned colored div */}
            <div className="absolute left-[-20vw] top-[-15vh] w-[140vw] h-[70vh] rotate-[-12deg] bg-gradient-to-r from-[#bb74fb] via-[#fc2994] to-[#fff] opacity-[0.86] pointer-events-none shadow-2xl" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
                <h1 className="font-headline text-[2.8rem] md:text-[5rem] lg:text-[6rem] font-extrabold tracking-tight text-black drop-shadow-xl">
                    Crafting  Memories
                    <span className="block bg-gradient-to-r from-[black] to-[black] bg-clip-text text-transparent">
           That Last Forever
          </span>
                </h1>
                <p className="mt-4 max-w-2xl text-lg md:text-2xl text-black/90 font-medium">
                    From weddings to corporate celebrations, Taraang Events brings your vision to life.
                </p>
                <Button
                    asChild
                    className="mt-10 px-10 py-4 text-lg rounded-full bg-gradient-to-r from-[red] to-[#fc2994] text-white shadow-2xl border-0 font-semibold transition-all duration-300 hover:brightness-110 hover:scale-105"
                    size="lg"
                >
                    <Link href="#contact">Plan your Event</Link>
                </Button>
            </div>
        </section>
    );
};

export default Hero;
