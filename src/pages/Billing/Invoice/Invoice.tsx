import { PDFViewer } from "@react-pdf/renderer";
import { InvoiceRenderer } from "components";
import { PageLayout } from "layouts";
import { InvoiceContext } from "./InvoiceContext";
import { InvoiceStatus } from "interface/Invoice/invoice.interface";
import { useSelector } from "react-redux";
import { getUser } from "redux/Login/selectors";
import { useState } from "react";
import { InvoiceGeneratorModal } from "components/Invoice/InvoiceGeneratorModal";

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
      <InvoiceGeneratorModal
        open={openInvoiceGenerator}
        setOpen={setOpenInvoiceGenerator}
      />
      <PDFViewer width="100%" height="600px">
        <InvoiceRenderer items={items} />
      </PDFViewer>
    </PageLayout>
  );
};
