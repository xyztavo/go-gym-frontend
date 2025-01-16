"use client";
import { motion, Variants } from "framer-motion";
import { rubik_mono_one, jetBrains_Mono } from "./fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const introPictureVariants: Variants = {
    hide: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const introHowItWorksVariants: Variants = {
    hide: {
      opacity: 0,
      x: 200,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`${jetBrains_Mono.className} overflow-x-hidden`}>
      <motion.div
        initial="hide"
        whileInView="show"
        exit="hide"
        variants={introPictureVariants}
      >
        <div className="flex lg:absolute mt-0 lg:mt-44">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-56 lg:w-96"
              src="/strongGopher.png"
              alt="Gym Logo"
            />
            <div className="flex flex-col items-center justify-center gap-8 lg:gap-2 border-muted lg:p-0 lg:bg-transparent  lg:m-0 p-2 m-4 lg:border-none">
              <h1
                className={
                  rubik_mono_one.className +
                  " lg:text-3xl text-lg text-center lg:text-center  lg:border-none border-b border-muted"
                }
              >
                Get Fit. Feel Great. Go Strong with Go Gym!
              </h1>
              <p
                className={
                  rubik_mono_one.className + " text-center  lg:text-center"
                }
              >
                Lift like a beast, look like a masterpiece
              </p>
              <Button variant={"link"} className="font-bold text-primary lg:text-white text-lg hover:bg-background transition-colors duration-700" asChild>
                <Link href={"/register"}>
                Register for free!
                </Link>
              </Button>
            </div>
             
          </div>
        </div>
        <div className="flex-col  lg:flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#00add8"
              fillOpacity="0.7"
              d="M0,128L60,128C120,128,240,128,360,154.7C480,181,600,235,720,218.7C840,203,960,117,1080,85.3C1200,53,1320,75,1380,85.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#00add8"
              fillOpacity="0.7"
              d="M0,128L60,128C120,128,240,128,360,154.7C480,181,600,235,720,218.7C840,203,960,117,1080,85.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>
      </motion.div>

      <div className="flex flex-col items-center justify-center gap-2">
        <motion.h1
          initial="hide"
          whileInView="show"
          exit="hide"
          variants={introPictureVariants}
          className={rubik_mono_one.className + " text-2xl"}
        >
          How it works
        </motion.h1>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 m-4">
          <motion.div
            initial="hide"
            whileInView="show"
            exit="hide"
            variants={introHowItWorksVariants}
            className="flex flex-col items-center justify-center border rounded-md border-muted p-4 gap-2  shadow-lg shadow-foreground/5"
          >
            <h1
              className={
                rubik_mono_one.className + " font-bold text-lg text-center"
              }
            >
              Gym Admin Features
            </h1>
            <p className="text-center">
              As a gym admin, you can create gyms, exercises, routines, and
              plans to keep your members engaged. Manage users with ease,
              oversee gym routines, and ensure smooth operations by scanning QR
              codes for quick and seamless member check-ins.
            </p>
          </motion.div>
          <motion.div
            initial="hide"
            whileInView="show"
            exit="hide"
            variants={introHowItWorksVariants}
            className="flex flex-col items-center border rounded-md border-muted p-4 gap-2  shadow-lg shadow-foreground/5"
          >
            <h1
              className={
                rubik_mono_one.className + " font-bold text-lg text-center"
              }
            >
              User Features
            </h1>
            <p className="text-center">
              As a user, you can register, log in, and stay on top of your
              fitness goals with detailed progress tracking. Explore a wide
              range of exercises and workouts, and enjoy the convenience of
              generating and scanning QR codes for quick and hassle-free gym
              check-ins.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
