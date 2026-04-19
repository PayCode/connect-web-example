import type { PayCodeConnect } from "@paycode/connect";
import { AnimatePresence, motion } from "motion/react";
import { type PropsWithChildren, useState } from "react";
import useMeasure from "react-use-measure";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Authenticate } from "./authenticate";
import { Capabilities } from "./capabilities";
import { Emv } from "./emv";
import { Pin } from "./pin";
import { Transaction } from "./transaction";

type CommandsSectionProps = {
  pc: PayCodeConnect | null;
};

export const CommandsSection = ({ pc }: CommandsSectionProps) => {
  const [tab, setTab] = useState("emv");
  const [elementRef, bounds] = useMeasure();

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-100">
      <TabsList>
        <TabsTrigger value="emv">EMV</TabsTrigger>
        <TabsTrigger value="authenticate">Authenticate</TabsTrigger>
        <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
        <TabsTrigger value="transaction">Transaction</TabsTrigger>
        <TabsTrigger value="pin">PIN</TabsTrigger>
      </TabsList>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          animate={{ height: bounds.height }}
          transition={{ duration: 0.27, ease: [0.25, 1, 0.5, 1] }}
        >
          <div ref={elementRef}>
            <TabsContent value="emv">
              <AnimationWrapper animationKey="emv-section">
                <Emv pc={pc} />
              </AnimationWrapper>
            </TabsContent>
            <TabsContent value="authenticate">
              <AnimationWrapper animationKey="auth-section">
                <Authenticate pc={pc} />
              </AnimationWrapper>
            </TabsContent>
            <TabsContent value="capabilities">
              <AnimationWrapper animationKey="capabilities-section">
                <Capabilities pc={pc} />
              </AnimationWrapper>
            </TabsContent>
            <TabsContent value="transaction">
              <AnimationWrapper animationKey="transaction-section">
                <Transaction pc={pc} />
              </AnimationWrapper>
            </TabsContent>
            <TabsContent value="pin">
              <AnimationWrapper animationKey="pin-section">
                <Pin pc={pc} />
              </AnimationWrapper>
            </TabsContent>
          </div>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
};

type AnimationWrapperProps = {
  animationKey: string;
};

const AnimationWrapper = ({
  animationKey,
  children,
}: PropsWithChildren<AnimationWrapperProps>) => (
  <AnimatePresence propagate>
    <motion.div
      key={animationKey}
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.15, ease: [0.26, 0.08, 0.25, 1] }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
