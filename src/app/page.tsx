"use client"
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Autoplay from 'embla-carousel-autoplay'


import { anonymousMessages } from "@/data/message";
import { Meteors } from "@/components/ui/meteors";

const rootLayout = () => {
  return (
    <div className="max-w-full h-full items-center p-10">
      <Meteors number={30}/>
      <main className="w-[70%] p-10 flex flex-col items-center space-y-6 mx-auto bg-white dark:bg-gradient-to-r from-slate-900 to-slate-700 rounded-md shadow-lg border-2border-red-600 shadow-zinc-600">
        <h1 className="text-4xl font-bold text-center">Where Words are Free, and Identities are Hidden</h1>
        <h3 className="text-lg">
          Send a message, leave a mystery—explore the art of anonymous
          communication.
        </h3>
        <Carousel plugins={[Autoplay({delay: 2000})]} className="w-[85%]">
          <CarouselContent className="-ml-1 mt-10">
            {anonymousMessages.map((message, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="w-30">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold">{message.sender}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center h-40 p-6">
                      <span className="text-base">
                        {message.message}
                      </span>
                    </CardContent>
                    <CardFooter>
                      {message.timeAgo}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer></footer>
    </div>
  );
};

export default rootLayout;
