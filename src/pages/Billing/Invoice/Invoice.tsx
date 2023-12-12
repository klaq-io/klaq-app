import { PDFViewer } from "@react-pdf/renderer";
import { InvoiceRenderer } from "components";
import { PageLayout } from "layouts";
import { useState } from "react";

export const Invoice = () => {
  const [items, setItems] = useState<
    { quantity: number; price: number; description: string }[]
  >([]);
  const [openInvoiceGenerator, setOpenInvoiceGenerator] = useState(false);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        quantity: 1,
        price: 3,
        description: "test",
      },
    ]);
  };
  return (
    <PageLayout>
      <div>Invoice</div>
      <button onClick={() => setOpenInvoiceGenerator(true)}>Add item</button>

      <PDFViewer width="100%" height="600px">
        <InvoiceRenderer items={items} />
      </PDFViewer>
    </PageLayout>
  );
};
