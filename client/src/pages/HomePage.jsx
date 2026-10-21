import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import { Lock, MapPin, FileEdit, FileText, Printer } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const MotionDiv = motion.div;

const previewContentVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.14,
    },
  },
};

const previewItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const workflowVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2,
    },
  },
};

const workflowStepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const workflowCircleVariants = {
  hidden: { scale: 0.7 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 16 },
  },
};

const workflowConnectorVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const features = [
    {
      title: "Multiple chambers",
      icon: MapPin,
      text: "Save each chamber with its address, registration number and visiting hours, then pick one for every prescription.",
    },
    {
      title: "Fast prescription entry",
      icon: FileEdit,
      text: "Enter patient details, clinical notes and any number of medicines in one focused form.",
    },
    {
      title: "Live A4 preview",
      icon: FileText,
      text: "Watch the finished prescription update as you type, laid out for A4 paper.",
    },
    {
      title: "Print or save as PDF",
      icon: Printer,
      text: "Print directly or choose Save as PDF, then stamp and sign by hand.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create account",
      text: "Register with your name, email and mobile number.",
    },
    {
      number: "2",
      title: "Add a chamber",
      text: "Save your registration number, address and visiting hours.",
    },
    {
      number: "3",
      title: "Create prescription",
      text: "Select a chamber, enter patient details and add medicines.",
    },
    {
      number: "4",
      title: "Print",
      text: "Review the A4 preview, print it, then stamp and sign by hand.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main id="main-content" className="flex-1">

        <section className="bg-[#EEF4F7] min-h-[560px] py-14 md:py-20 border-b border-[#D5DDE3]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            <MotionDiv
              initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col"
            >
              <h1 className="text-hero max-w-[600px] text-[#14232B] font-semibold text-[32px] leading-[40px] md:text-[44px] md:leading-[52px]">
                Print-ready prescriptions for every chamber you practise in
              </h1>

              <p className="mt-5 text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-[#3F4F5A] max-w-[560px]">
                Create an account, save your chambers once, and prepare clear A4
                prescriptions in minutes.
              </p>

              <MotionDiv
                initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                className="mt-8 flex flex-col mobile-lg:flex-row gap-3"
              >
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <motion.div whileHover={shouldAnimate ? { y: -2, scale: 1.01 } : undefined} whileTap={shouldAnimate ? { scale: 0.99 } : undefined}>
                      <Button variant="primary" size="large">
                        Go to Dashboard
                      </Button>
                    </motion.div>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <motion.div whileHover={shouldAnimate ? { y: -2, scale: 1.01 } : undefined} whileTap={shouldAnimate ? { scale: 0.99 } : undefined}>
                        <Button variant="primary" size="large">
                          Register as a Doctor
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/login">
                      <motion.div whileHover={shouldAnimate ? { y: -2, scale: 1.01 } : undefined} whileTap={shouldAnimate ? { scale: 0.99 } : undefined}>
                        <Button variant="secondary" size="large">
                          Doctor Login
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </MotionDiv>

              <MotionDiv
                initial={shouldAnimate ? { opacity: 0 } : false}
                animate={shouldAnimate ? { opacity: 1 } : undefined}
                transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
                className="mt-6 flex items-center gap-2 text-[13px] leading-[20px] text-[#5F6F7A]"
              >
                <Lock className="w-4 h-4 text-[#5F6F7A] shrink-0" strokeWidth={1.75} />
                <span>Patient details are never stored on our servers.</span>
              </MotionDiv>
            </MotionDiv>

            <div className="hidden lg:flex lg:col-span-5 justify-center">
              <MotionDiv
                initial={shouldAnimate ? { opacity: 0, y: 24, rotate: 2 } : false}
                animate={shouldAnimate ? { opacity: 1, y: 0, rotate: 0 } : undefined}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <MotionDiv
                  animate={shouldAnimate ? { y: [0, -7, 0] } : undefined}
                  transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.7,
                  }}
                  aria-hidden="true"
                  className="w-[340px] h-[481px] bg-white rounded-[8px] border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] p-6"
                >
                  <MotionDiv
                    variants={previewContentVariants}
                    initial={shouldAnimate ? "hidden" : false}
                    animate={shouldAnimate ? "visible" : undefined}
                    className="h-full flex flex-col justify-between"
                  >
                    <div>

                      <MotionDiv
                        variants={previewItemVariants}
                        className="flex justify-between items-start gap-4"
                      >
                        <div className="space-y-2">
                          <div className="w-28 h-3.5 bg-[#D5DDE3] rounded" />
                          <div className="w-20 h-2.5 bg-[#D5DDE3] rounded" />
                        </div>
                        <div className="space-y-1.5 text-right">
                          <div className="w-24 h-3 bg-[#E4EAEE] rounded ml-auto" />
                          <div className="w-20 h-2 bg-[#E4EAEE] rounded ml-auto" />
                        </div>
                      </MotionDiv>

                      <MotionDiv
                        variants={previewItemVariants}
                        className="w-full h-[1.5px] bg-[#14232B] my-4"
                      />

                      <MotionDiv
                        variants={previewItemVariants}
                        className="flex gap-4 pb-2 border-b border-[#D5DDE3]"
                      >
                        <div className="flex-1 h-2 bg-[#E4EAEE] rounded" />
                        <div className="w-16 h-2 bg-[#E4EAEE] rounded" />
                        <div className="w-14 h-2 bg-[#E4EAEE] rounded" />
                      </MotionDiv>

                      <MotionDiv variants={previewItemVariants} className="mt-6">
                        <div className="text-[28px] font-serif font-bold text-[#B7C3CC] leading-none mb-3">
                          ℞
                        </div>
                        <div className="space-y-3">
                          <div className="w-full h-3 bg-[#E4EAEE] rounded" />
                          <div className="w-5/6 h-3 bg-[#E4EAEE] rounded" />
                          <div className="w-4/6 h-3 bg-[#E4EAEE] rounded" />
                        </div>
                      </MotionDiv>
                    </div>

                    <MotionDiv
                      variants={previewItemVariants}
                      className="flex justify-end pt-4"
                    >
                      <div className="w-32 border-b border-[#14232B] pb-1">
                        <div className="w-20 h-2 bg-[#E4EAEE] rounded mx-auto" />
                      </div>
                    </MotionDiv>
                  </MotionDiv>
                </MotionDiv>
              </MotionDiv>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white border-b border-[#D5DDE3] scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
            <div>
              <h2 className="text-section-heading text-[24px] md:text-[28px] text-[#14232B] font-semibold">
                Built around how you prescribe
              </h2>
              <p className="mt-2 text-[16px] leading-[26px] text-[#3F4F5A] max-w-[640px]">
                Everything needed to prepare a prescription, and nothing that isn’t.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-4 gap-6">
              {features.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-[8px] bg-white border border-[#D5DDE3] shadow-[0_1px_2px_rgba(20,35,43,0.04)] flex flex-col"
                  >
                    <div className="w-10 h-10 rounded-[6px] bg-[#E6F0F4] flex items-center justify-center text-[#0F5A78] mb-4">
                      <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-[16px] leading-[24px] font-semibold text-[#14232B]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-[#F4F6F8] border-b border-[#D5DDE3] scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
            <MotionDiv
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="text-section-heading text-[24px] md:text-[28px] text-[#14232B] font-semibold"
            >
              From sign-up to printout in four steps
            </MotionDiv>

            <MotionDiv
              variants={workflowVariants}
              initial={shouldAnimate ? "hidden" : false}
              whileInView={shouldAnimate ? "visible" : undefined}
              viewport={{ once: true, amount: 0.25 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative"
            >
              {steps.map((st, idx) => (
                <MotionDiv
                  key={idx}
                  variants={workflowStepVariants}
                  className="flex flex-col relative"
                >

                  <div className="flex items-center mb-4">
                    <MotionDiv
                      variants={workflowCircleVariants}
                      className="w-8 h-8 rounded-full bg-[#0F5A78] flex items-center justify-center text-white text-[14px] font-semibold shrink-0"
                    >
                      {st.number}
                    </MotionDiv>
                    {idx < steps.length - 1 && (
                      <MotionDiv
                        variants={workflowConnectorVariants}
                        className="hidden md:block flex-1 h-[1px] bg-[#B7C3CC] ml-3 mr-3 origin-left"
                      />
                    )}
                  </div>

                  <h3 className="text-[16px] leading-[24px] font-semibold text-[#14232B]">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22px] text-[#3F4F5A] max-w-[240px]">
                    {st.text}
                  </p>
                </MotionDiv>
              ))}
            </MotionDiv>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-[880px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="p-5 rounded-[6px] bg-[#EAF3F8] border border-[#BFD8E6] flex items-start gap-4">
              <Lock className="w-5 h-5 text-[#0F5A78] shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="text-[14px] leading-[22px] text-[#14232B]">
                <strong className="font-semibold block mb-1">Your patients’ privacy</strong>
                Doctor accounts and chamber details are saved to your account.
                Patient details, diagnoses and prescriptions stay in your browser
                and are cleared when you close or refresh the page.
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
