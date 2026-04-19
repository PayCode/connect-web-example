import type { PayCodeConnect } from "@paycode/connect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Authenticate } from "./authenticate";
import { Capabilities } from "./capabilities";
import { Emv } from "./emv";
import { Pin } from "./pin";
import { Transaction } from "./transaction";

type CommandsSectionProps = {
  pc: PayCodeConnect | null;
};

export const CommandsSection = ({ pc }: CommandsSectionProps) => (
  <Tabs defaultValue="emv" className="w-100">
    <TabsList>
      <TabsTrigger value="emv">EMV</TabsTrigger>
      <TabsTrigger value="authenticate">Authenticate</TabsTrigger>
      <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
      <TabsTrigger value="transaction">Transaction</TabsTrigger>
      <TabsTrigger value="pin">PIN</TabsTrigger>
    </TabsList>
    <TabsContent value="emv">
      <Emv pc={pc} />
    </TabsContent>
    <TabsContent value="authenticate">
      <Authenticate pc={pc} />
    </TabsContent>
    <TabsContent value="capabilities">
      <Capabilities pc={pc} />
    </TabsContent>
    <TabsContent value="transaction">
      <Transaction pc={pc} />
    </TabsContent>
    <TabsContent value="pin">
      <Pin pc={pc} />
    </TabsContent>
  </Tabs>
);
