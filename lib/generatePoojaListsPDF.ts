import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type PoojaBookingPdfData = {
  bookingNumber: string;
  poojaName: string;
  amount: number;
  devoteeName: string;
  devoteePhone: string | null;
  devoteeAddress: string | null;
  year: number;
  bookingDate: string;
  bookingStatus: string;
  notes: string | null;
  createdAt: string;
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number): string {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

function loadImageAsDataUrl(
  src: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas =
        document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context =
        canvas.getContext("2d");

      if (!context) {
        reject(
          new Error(
            "Unable to create image context."
          )
        );
        return;
      }

      context.drawImage(
        image,
        0,
        0
      );

      resolve(
        canvas.toDataURL("image/jpeg", 0.95)
      );
    };

    image.onerror = () => {
      reject(
        new Error(
          "Unable to load HYV logo."
        )
      );
    };

    image.src = src;
  });
}

export async function generatePoojaBookingsPdf(
  bookings: PoojaBookingPdfData[],
  year: number
): Promise<void> {
  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "CONFIRMED"
    );

  if (
    confirmedBookings.length === 0
  ) {
    throw new Error(
      `No confirmed Pooja bookings found for ${year}.`
    );
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  /*
   * --------------------------------------------------
   * COLORS
   * --------------------------------------------------
   */

  const orange: [
    number,
    number,
    number
  ] = [234, 88, 12];

  const saffron: [
    number,
    number,
    number
  ] = [249, 115, 22];

  const golden: [
    number,
    number,
    number
  ] = [251, 191, 36];

  const lightYellow: [
    number,
    number,
    number
  ] = [255, 247, 214];

  const darkBrown: [
    number,
    number,
    number
  ] = [59, 36, 21];

  const gray: [
    number,
    number,
    number
  ] = [120, 113, 108];

  /*
   * --------------------------------------------------
   * TOP BRANDING
   * --------------------------------------------------
   */

  /*
   * Top golden/orange strip
   */
  pdf.setFillColor(
    ...orange
  );

  pdf.rect(
    0,
    0,
    pageWidth,
    5,
    "F"
  );

  /*
   * Logo
   */
  try {
    const logo =
      await loadImageAsDataUrl(
        "/images/Hyv_logo.jpg"
      );

    pdf.addImage(
      logo,
      "JPEG",
      14,
      12,
      28,
      28
    );
  } catch (error) {
    console.warn(
      "HYV logo could not be loaded:",
      error
    );

    /*
     * Fallback circular HYV mark
     */
    pdf.setFillColor(
      ...golden
    );

    pdf.circle(
      28,
      26,
      14,
      "F"
    );

    pdf.setTextColor(
      ...darkBrown
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(12);

    pdf.text(
      "HYV",
      28,
      30,
      {
        align: "center",
      }
    );
  }

  /*
   * Organization name
   */
  pdf.setTextColor(
    ...orange
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(22);

  pdf.text(
    "HINDUSTAN YUVA VRINDHA",
    50,
    20
  );

  /*
   * Location
   */
  pdf.setTextColor(
    ...darkBrown
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(11);

  pdf.text(
    "Tank Road, Malur",
    50,
    28
  );

  /*
   * Decorative subtitle
   */
  pdf.setTextColor(
    ...gray
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(9);

  pdf.text(
    "Devotion • Tradition • Service • Togetherness",
    50,
    35
  );

  /*
   * --------------------------------------------------
   * TITLE BOX
   * --------------------------------------------------
   */

  pdf.setFillColor(
    ...lightYellow
  );

  pdf.roundedRect(
    14,
    47,
    pageWidth - 28,
    24,
    4,
    4,
    "F"
  );

  /*
   * Orange left accent
   */
  pdf.setFillColor(
    ...orange
  );

  pdf.roundedRect(
    14,
    47,
    5,
    24,
    2,
    2,
    "F"
  );

  pdf.setTextColor(
    ...darkBrown
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(17);

  pdf.text(
    `POOJA BOOKING LIST - ${year}`,
    27,
    58
  );

  pdf.setTextColor(
    ...orange
  );

  pdf.setFontSize(10);

  pdf.text(
    `Confirmed Bookings: ${confirmedBookings.length}`,
    27,
    65
  );

  /*
   * --------------------------------------------------
   * TABLE DATA
   * --------------------------------------------------
   */

  const tableRows =
    confirmedBookings.map(
      (booking, index) => [
        String(index + 1),

        booking.bookingNumber,

        booking.devoteeName,

        booking.devoteePhone ||
          "-",

        booking.poojaName,

        formatDate(
          booking.bookingDate
        ),

      ]
    );

  /*
   * --------------------------------------------------
   * TABLE
   * --------------------------------------------------
   */

  autoTable(pdf, {
    startY: 78,

    head: [
      [
        "Sl. No.",
        "Booking No.",
        "Devotee Name",
        "Phone",
        "Pooja",
        "Booking Date",
      ],
    ],

    body: tableRows,

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 3,
      textColor: darkBrown,
      lineColor: [
        230,
        220,
        205,
      ],
      lineWidth: 0.2,
      valign: "middle",
    },

    headStyles: {
      fillColor: orange,
      textColor: [
        255,
        255,
        255,
      ],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
      valign: "middle",
    },

    alternateRowStyles: {
      fillColor: [
        255,
        251,
        239,
      ],
    },

    columnStyles: {
      0: {
        cellWidth: 15,
        halign: "center",
      },

      1: {
        cellWidth: 35,
        fontSize: 7.5,
      },

      2: {
        cellWidth: 48,
      },

      3: {
        cellWidth: 32,
      },

      4: {
        cellWidth: 38,
      },

      5: {
        cellWidth: 34,
        halign: "center",
      },

      6: {
        cellWidth: 30,
        halign: "right",
        fontStyle: "bold",
      },
    },

    margin: {
      left: 14,
      right: 14,
      bottom: 22,
    },

    didDrawPage: () => {
      /*
       * ------------------------------------------------
       * FOOTER
       * ------------------------------------------------
       */

      pdf.setDrawColor(
        ...golden
      );

      pdf.setLineWidth(0.5);

      pdf.line(
        14,
        pageHeight - 15,
        pageWidth - 14,
        pageHeight - 15
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(8);

      pdf.setTextColor(
        ...gray
      );

      pdf.text(
        "Hindustan Yuva Vrindha • Tank Road, Malur",
        14,
        pageHeight - 9
      );

      pdf.text(
        `Page ${pdf.getNumberOfPages()}`,
        pageWidth - 14,
        pageHeight - 9,
        {
          align: "right",
        }
      );
    },
  });

  /*
   * --------------------------------------------------
   * SAVE
   * --------------------------------------------------
   */

  const fileName =
    `hindustan_yuva_vrindha_poojas_list_${year}.pdf`;

  pdf.save(fileName);
}