import Image from "next/image"
import { Check } from "lucide-react"

export default function Home() {
  return (
    <main 
      className="flex flex-col mx-auto"
      style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--hotel-primary) 20%, white), color-mix(in srgb, var(--hotel-primary) 10%, white), white)' }}
    >
      {/* Venue Overview Section */}
      <section className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-0"> 
        <div className="w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src="/hall/mahal-auditorium.jpeg"
            alt="Luxury banquet hall auditorium with elegant stage and seating"
            width={800}
            height={600}
            className="w-full h-full object-cover rounded-lg md:rounded-none"
            priority
          />
        </div>
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-hotel-primary-text mb-4 sm:mb-6">Why Choose Renganathan Gandhimathi Palace?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-hotel-secondary-grey mb-4 sm:mb-6">
          Because every event deserves the best stage
          </p>
          <div className="space-y-1">
            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 w-4  sm:w-5" />
              <span className="text-sm sm:text-base  text-hotel-secondary-grey">Largest and most spacious marriage hall in the region</span>
            </div>
            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base text-hotel-secondary-grey">Two independent halls for events of all sizes</span>
            </div>
            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base  text-hotel-secondary-grey"> Dedicated dining & kitchen spaces for each hall</span>
            </div>

            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base  text-hotel-secondary-grey">Optional outdoor dining area</span>
            </div>
            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base text-hotel-secondary-grey">In-house catering for up to 1,000 guests</span>
            </div>
            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base text-hotel-secondary-grey">10 modern, comfortable rooms for guests</span>
            </div>

            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base  text-hotel-secondary-grey">Massive, well-planned parking area</span>
            </div>

            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base text-hotel-secondary-grey">Trusted décor vendors</span>
            </div>
            <div className="flex items-center">
              <Check className="text-hotel-primary mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base  text-hotel-secondary-grey">Designed for convenience, elegance & unforgettable celebrations</span>
            </div>
            
          </div>
        </div>
      </section>

    
    </main>
  )
}
