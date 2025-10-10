// "use client"

// import { motion, AnimatePresence } from "framer-motion"
// import { useState, useEffect } from "react"
// import { Star, Quote } from "lucide-react"

// const testimonials = [
//   {
//     name: "Sarah Johnson",
//     role: "E-commerce Owner",
//     company: "StyleHub",
//     image: "/professional-woman-entrepreneur-smiling.jpg",
//     quote:
//       "Yazzil transformed our Instagram DMs from a time sink into our #1 revenue channel. We went from 20 conversations a day to 500+, and our conversion rate tripled.",
//     rating: 5,
//     color: "cyan",
//     stats: { metric: "300%", label: "Revenue Increase" },
//   },
//   {
//     name: "Marcus Chen",
//     role: "Digital Marketing Agency",
//     company: "GrowthLab",
//     image: "/professional-asian-man-entrepreneur.jpg",
//     quote:
//       "As an agency managing 50+ clients, Yazzil is a game-changer. We can now offer DM automation as a premium service, and our clients are seeing incredible results.",
//     rating: 5,
//     color: "orange",
//     stats: { metric: "50+", label: "Clients Served" },
//   },
//   {
//     name: "Emily Rodriguez",
//     role: "Fitness Coach",
//     company: "FitLife Studio",
//     image: "/professional-fitness-coach-woman.jpg",
//     quote:
//       "I was drowning in DMs and missing potential clients. Yazzil handles qualification and booking automatically. I focus on coaching, not admin work.",
//     rating: 5,
//     color: "green",
//     stats: { metric: "10x", label: "More Bookings" },
//   },
//   {
//     name: "David Park",
//     role: "SaaS Founder",
//     company: "TechFlow",
//     image: "/professional-tech-entrepreneur-man.jpg",
//     quote:
//       "The ROI is insane. We spent $99/month and generated an extra $15K in the first month alone. Yazzil pays for itself 150x over.",
//     rating: 5,
//     color: "blue",
//     stats: { metric: "$15K", label: "First Month Revenue" },
//   },
// ]

// export function MorphingTestimonials() {
//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % testimonials.length)
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [])

//   const current = testimonials[currentIndex]

//   return (
//     <section className="py-32 bg-white relative overflow-hidden">
//       {/* Background decoration */}
//       <div className="absolute inset-0">
//         <motion.div
//           className={`absolute top-0 right-0 w-[600px] h-[600px] bg-${current.color}-500/5 rounded-full blur-3xl`}
//           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
//           transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
//         />
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         <motion.div
//           className="text-center mb-20"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-5xl md:text-7xl font-bold mb-6">
//             Real Stories,
//             <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-orange-500 to-green-500">
//               Real Results
//             </span>
//           </h2>
//           <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
//             Join thousands of businesses already crushing it with Yazzil
//           </p>
//         </motion.div>

//         {/* Main testimonial card */}
//         <div className="max-w-6xl mx-auto">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentIndex}
//               initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
//               animate={{ opacity: 1, scale: 1, rotateY: 0 }}
//               exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
//               transition={{ duration: 0.6 }}
//               className="relative"
//             >
//               <div
//                 className={`bg-gradient-to-br from-${current.color}-50 to-white rounded-[3rem] p-12 md:p-16 shadow-2xl border-2 border-${current.color}-500/20`}
//               >
//                 {/* Quote icon */}
//                 <motion.div
//                   className={`absolute -top-6 -left-6 w-20 h-20 bg-${current.color}-500 rounded-3xl flex items-center justify-center shadow-xl`}
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ delay: 0.3, type: "spring" }}
//                 >
//                   <Quote className="w-10 h-10 text-white" />
//                 </motion.div>

//                 <div className="grid md:grid-cols-2 gap-12 items-center">
//                   {/* Image side */}
//                   <motion.div
//                     className="relative"
//                     initial={{ x: -50, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <div className="relative">
//                       {/* Glow effect */}
//                       <div
//                         className={`absolute -inset-4 bg-gradient-to-br from-${current.color}-500/30 to-transparent rounded-[2.5rem] blur-2xl`}
//                       />

//                       {/* Image */}
//                       <img
//                         src={current.image || "/placeholder.svg"}
//                         alt={current.name}
//                         className="relative rounded-[2rem] w-full shadow-2xl"
//                       />

//                       {/* Floating stat */}
//                       <motion.div
//                         className={`absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border-2 border-${current.color}-500/20`}
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: 0.5, type: "spring" }}
//                       >
//                         <div className={`text-4xl font-bold text-${current.color}-500`}>{current.stats.metric}</div>
//                         <div className="text-sm text-neutral-600">{current.stats.label}</div>
//                       </motion.div>
//                     </div>
//                   </motion.div>

//                   {/* Content side */}
//                   <motion.div
//                     initial={{ x: 50, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ delay: 0.3 }}
//                   >
//                     {/* Stars */}
//                     <div className="flex gap-1 mb-6">
//                       {[...Array(current.rating)].map((_, i) => (
//                         <motion.div
//                           key={i}
//                           initial={{ scale: 0, rotate: -180 }}
//                           animate={{ scale: 1, rotate: 0 }}
//                           transition={{ delay: 0.4 + i * 0.1 }}
//                         >
//                           <Star className={`w-6 h-6 fill-${current.color}-500 text-${current.color}-500`} />
//                         </motion.div>
//                       ))}
//                     </div>

//                     {/* Quote */}
//                     <p className="text-2xl md:text-3xl font-medium text-neutral-800 mb-8 leading-relaxed">
//                       &ldquo;{current.quote}&rdquo;
//                     </p>

//                     {/* Author */}
//                     <div>
//                       <div className="text-2xl font-bold mb-1">{current.name}</div>
//                       <div className="text-lg text-neutral-600">{current.role}</div>
//                       <div className={`text-lg font-medium text-${current.color}-500`}>{current.company}</div>
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* Navigation dots */}
//           <div className="flex justify-center gap-3 mt-12">
//             {testimonials.map((_, index) => (
//               <motion.button
//                 key={index}
//                 onClick={() => setCurrentIndex(index)}
//                 className={`h-3 rounded-full transition-all ${
//                   index === currentIndex ? "w-12 bg-cyan-500" : "w-3 bg-neutral-300"
//                 }`}
//                 whileHover={{ scale: 1.2 }}
//                 whileTap={{ scale: 0.9 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Testimonial grid */}
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.6 }}
//         >
//           {testimonials.map((testimonial, i) => (
//             <motion.button
//               key={i}
//               onClick={() => setCurrentIndex(i)}
//               className={`p-6 rounded-2xl border-2 transition-all text-left ${
//                 i === currentIndex
//                   ? `border-${testimonial.color}-500 bg-${testimonial.color}-50`
//                   : "border-neutral-200 bg-white hover:border-neutral-300"
//               }`}
//               whileHover={{ y: -5 }}
//             >
//               <img
//                 src={testimonial.image || "/placeholder.svg"}
//                 alt={testimonial.name}
//                 className="w-16 h-16 rounded-full mb-4 object-cover"
//               />
//               <div className="font-bold mb-1">{testimonial.name}</div>
//               <div className="text-sm text-neutral-600">{testimonial.company}</div>
//             </motion.button>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   )
// }


"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Owner",
    company: "StyleHub",
    image: "/professional-woman-entrepreneur-smiling.jpg",
    quote:
      "Yazzil transformed our Instagram DMs from a time sink into our #1 revenue channel. We went from 20 conversations a day to 500+, and our conversion rate tripled.",
    rating: 5,
    color: "cyan",
    stats: { metric: "300%", label: "Revenue Increase" },
  },
  {
    name: "Marcus Chen",
    role: "Digital Marketing Agency",
    company: "GrowthLab",
    image: "/professional-asian-man-entrepreneur.jpg",
    quote:
      "As an agency managing 50+ clients, Yazzil is a game-changer. We can now offer DM automation as a premium service, and our clients are seeing incredible results.",
    rating: 5,
    color: "orange",
    stats: { metric: "50+", label: "Clients Served" },
  },
  {
    name: "Emily Rodriguez",
    role: "Fitness Coach",
    company: "FitLife Studio",
    image: "/professional-fitness-coach-woman.jpg",
    quote:
      "I was drowning in DMs and missing potential clients. Yazzil handles qualification and booking automatically. I focus on coaching, not admin work.",
    rating: 5,
    color: "green",
    stats: { metric: "10x", label: "More Bookings" },
  },
  {
    name: "David Park",
    role: "SaaS Founder",
    company: "TechFlow",
    image: "/professional-tech-entrepreneur-man.jpg",
    quote:
      "The ROI is insane. We spent $99/month and generated an extra $15K in the first month alone. Yazzil pays for itself 150x over.",
    rating: 5,
    color: "blue",
    stats: { metric: "$15K", label: "First Month Revenue" },
  },
]

export function MorphingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const current = testimonials[currentIndex]

  return (
    <section className="py-32 bg-neutral-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Real Stories,
            <span className="block mt-2 text-cyan-400">Real Results</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Join thousands of businesses already crushing it with Yazzil
          </p>
        </motion.div>

        {/* Main testimonial card */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-neutral-800 rounded-[3rem] p-12 md:p-16 shadow-2xl border-2 border-neutral-700">
                {/* Quote icon */}
                <motion.div
                  className="absolute -top-6 -left-6 w-20 h-20 bg-cyan-500 rounded-3xl flex items-center justify-center shadow-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Quote className="w-10 h-10 text-white" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Image side */}
                  <motion.div
                    className="relative"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-4 bg-cyan-500/20 rounded-[2.5rem] blur-2xl" />

                      {/* Image */}
                      <img
                        src={current.image || "/placeholder.svg"}
                        alt={current.name}
                        className="relative rounded-[2rem] w-full shadow-2xl"
                      />

                      {/* Floating stat */}
                      <motion.div
                        className="absolute -bottom-6 -right-6 bg-neutral-900 rounded-2xl p-6 shadow-xl border-2 border-cyan-500/20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <div className="text-4xl font-bold text-cyan-400">{current.stats.metric}</div>
                        <div className="text-sm text-neutral-400">{current.stats.label}</div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Content side */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(current.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                        >
                          <Star className="w-6 h-6 fill-cyan-400 text-cyan-400" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-2xl md:text-3xl font-medium text-neutral-200 mb-8 leading-relaxed">
                      &ldquo;{current.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div>
                      <div className="text-2xl font-bold mb-1 text-white">{current.name}</div>
                      <div className="text-lg text-neutral-400">{current.role}</div>
                      <div className="text-lg font-medium text-cyan-400">{current.company}</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex ? "w-12 bg-cyan-500" : "w-3 bg-neutral-700"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* Testimonial grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                i === currentIndex
                  ? "border-cyan-500 bg-neutral-800"
                  : "border-neutral-700 bg-neutral-900 hover:border-neutral-600"
              }`}
              whileHover={{ y: -5 }}
            >
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mb-4 object-cover"
              />
              <div className="font-bold mb-1 text-white">{testimonial.name}</div>
              <div className="text-sm text-neutral-400">{testimonial.company}</div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
