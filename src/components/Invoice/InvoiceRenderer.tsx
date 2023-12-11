import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

{
  /* <InvoiceContext.Provider
value={{
  paymentDue: new Date(),
  issuedOn: new Date(),
  status: InvoiceStatus.SENT,
  products: [
    {
      quantity: 1,
      price: 3,
      description: "test",
      title: "produit",
      vtaRate: "20",
    },
  ],
  number: "1",
}}
>
<Invoice.
</InvoiceContext.Provider> */
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    fontSize: 14,
    paddingTop: 64,
    paddingLeft: 64,
    paddingRight: 64,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: "auto",
    marginRight: "auto",
  },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
});

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJbecmNE.woff2",
    },
  ],
});

type InvoiceProps = {
  items?: { quantity: number; price: number; description: string }[];
};

export const InvoiceRenderer = (props: InvoiceProps) => {
  const { items } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {items &&
          items.length &&
          items.map((item) => (
            <View style={styles.product}>
              <Text>{item.description}</Text>
              <Text>{item.price}</Text>
            </View>
          ))}
      </Page>
    </Document>
  );
};
