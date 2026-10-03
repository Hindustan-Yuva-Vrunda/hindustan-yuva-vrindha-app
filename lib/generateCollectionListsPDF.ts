import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type CollectionPdfData = {
  id: string;
  contributorName: string;
  contributorPhone: string | null;
  amount: number;
  year: number;
  contributionDate: string;
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number): string {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function loadImageAsDataUrl(
  src: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(
          new Error("Unable to create image context.")
        );
        return;
      }

      context.drawImage(image, 0, 0);

      resolve(
        canvas.toDataURL("image/jpeg", 0.95)
      );
    };

    image.onerror = () => {
      reject(
        new Error("Unable to load HYV logo.")
      );
    };

    image.src = src;
  });
}

export async function generateCollectionPdf(
  collections: CollectionPdfData[],
  year: number
): Promise<void> {
  if (collections.length === 0) {
    throw new Error(
      `No collections found for ${year}.`
    );
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const orange: [number, number, number] = [
    234, 88, 12,
  ];

  const golden: [number, number, number] = [
    251, 191, 36,
  ];

  const darkBrown: [number, number, number] = [
    59, 36, 21,
  ];

  const gray: [number, number, number] = [
    120, 113, 108,
  ];

  const lightYellow: [number, number, number] = [
    255, 247, 214,
  ];

  // ============================================================
  // TOP ORANGE STRIP
  // ============================================================

  pdf.setFillColor(...orange);

  pdf.rect(
    0,
    0,
    pageWidth,
    5,
    "F"
  );

  // ============================================================
  // HYV LOGO
  // ============================================================

  try {
    const logo = await loadImageAsDataUrl(
      "/images/Hyv_logo.jpg"
    );

    pdf.addImage(
      logo,
      "JPEG",
      15,
      12,
      28,
      28
    );
  } catch (error) {
    console.warn(
      "HYV logo could not be loaded:",
      error
    );

    pdf.setFillColor(...golden);

    pdf.circle(
      29,
      26,
      14,
      "F"
    );

    pdf.setTextColor(...darkBrown);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(12);

    pdf.text(
      "HYV",
      29,
      30,
      {
        align: "center",
      }
    );
  }

  // ============================================================
  // ORGANIZATION NAME
  // ============================================================

  pdf.setTextColor(...orange);

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(20);

  pdf.text(
    "HINDUSTAN YUVA VRINDHA",
    50,
    21
  );

  // ============================================================
  // LOCATION
  // ============================================================

  pdf.setTextColor(...darkBrown);

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(11);

  pdf.text(
    "Tank Road, Malur",
    50,
    29
  );

  // ============================================================
  // SUBTITLE
  // ============================================================

  pdf.setTextColor(...gray);

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(9);

  pdf.text(
    "Collection / Contribution List",
    50,
    36
  );

  // ============================================================
  // DIVIDER
  // ============================================================

  pdf.setDrawColor(...golden);

  pdf.setLineWidth(1);

  pdf.line(
    15,
    45,
    pageWidth - 15,
    45
  );

  // ============================================================
  // TOTAL
  // ============================================================

  const totalAmount =
    collections.reduce(
      (total, collection) =>
        total +
        Number(collection.amount || 0),
      0
    );

  // ============================================================
  // TITLE BOX
  // ============================================================

  pdf.setFillColor(...lightYellow);

  pdf.roundedRect(
    15,
    52,
    pageWidth - 30,
    28,
    4,
    4,
    "F"
  );

  pdf.setTextColor(...darkBrown);

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(17);

  pdf.text(
    `COLLECTION LIST - ${year}`,
    pageWidth / 2,
    63,
    {
      align: "center",
    }
  );

  pdf.setTextColor(...orange);

  pdf.setFontSize(10);

  pdf.text(
    `Total Entries: ${collections.length}`,
    pageWidth / 2,
    70,
    {
      align: "center",
    }
  );

  pdf.setTextColor(...darkBrown);

  pdf.setFontSize(11);

  pdf.text(
    `Total Collection: ${formatAmount(totalAmount)}`,
    pageWidth / 2,
    76,
    {
      align: "center",
    }
  );

  // ============================================================
  // TABLE DATA
  // ============================================================

  const tableRows = collections.map(
    (collection, index) => [
      String(index + 1),

      String(
        collection.contributorName || "-"
      ),

      String(
        collection.contributorPhone || "-"
      ),

      formatDate(
        collection.contributionDate
      ),

      /*
       * IMPORTANT:
       * Amount is explicitly converted to a
       * plain ASCII string.
       *
       * Do NOT use ₹ here because Helvetica
       * does not support the Rupee glyph.
       */
      formatAmount(
        Number(collection.amount || 0)
      ),
    ]
  );

  // ============================================================
  // TABLE
  // ============================================================

  autoTable(pdf, {
    startY: 88,

    head: [
      [
        "Sl. No.",
        "Contributor Name",
        "Mobile Number",
        "Collection Date",
        "Amount",
      ],
    ],

    body: tableRows,

    theme: "grid",

    styles: {
      font: "helvetica",

      fontSize: 9,

      cellPadding: {
        top: 4,
        bottom: 4,
        left: 2.5,
        right: 2.5,
      },

      textColor: darkBrown,

      lineColor: [
        230,
        220,
        205,
      ],

      lineWidth: 0.25,

      valign: "middle",

      overflow: "linebreak",
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

      cellPadding: {
        top: 4,
        bottom: 4,
        left: 2,
        right: 2,
      },
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
        cellWidth: 16,
        halign: "center",
      },

      1: {
        cellWidth: 52,
        fontStyle: "bold",
      },

      2: {
        cellWidth: 39,
        halign: "center",
      },

      3: {
        cellWidth: 39,
        halign: "center",
      },

      /*
       * Amount gets 34mm.
       * Rs. 1,25,000.00 will fit.
       */
      4: {
        cellWidth: 34,
        halign: "right",
        fontStyle: "bold",
        overflow: "linebreak",
      },
    },

    margin: {
      left: 15,
      right: 15,
      bottom: 22,
    },

    // ==========================================================
    // FOOTER
    // ==========================================================

    didDrawPage: () => {
      pdf.setDrawColor(...golden);

      pdf.setLineWidth(0.5);

      pdf.line(
        15,
        pageHeight - 15,
        pageWidth - 15,
        pageHeight - 15
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(8);

      pdf.setTextColor(...gray);

      pdf.text(
        "Hindustan Yuva Vrindha • Tank Road, Malur",
        15,
        pageHeight - 9
      );

      pdf.text(
        `Page ${pdf.getNumberOfPages()}`,
        pageWidth - 15,
        pageHeight - 9,
        {
          align: "right",
        }
      );
    },
  });

  // ============================================================
  // SAVE
  // ============================================================

  pdf.save(
    `hindustan_yuva_vrindha_collections_list_${year}.pdf`
  );
}