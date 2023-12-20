import jsPDF from "jspdf";
import "jspdf-autotable";
import apis from "../services/apis";
import TumbnailImage from "../assets/images/tumbhnail.svg";
//import "../assets/calibri";
import axios from "axios";

export async function PdfGenerator(
  columns,
  companySettingData,
  body,
  fileName,
  name
) {
  let imagePresent = false;
  const checkImage = async () => {
    if (companySettingData?.image) {
      await axios
        .get(`${apis.serverpath1}public/images/${companySettingData.image}`)
        .then((data) => {
          imagePresent = true;
        })
        .catch((error) => {
          imagePresent = false;
        });
    } else {
      imagePresent = false;
    }
  };

  const check = await checkImage();

  const doc = new jsPDF();
  doc.setFont("Arial Unicode MS Font"); // <-- place here your font name, which you remeber before
  doc.setCreationDate(new Date());

  doc.roundedRect(9, 9, 190, 35, 7, 7);
  let companyDetailsX = 15;
  if (imagePresent) {
    let img = new Image();
    img.src = companySettingData?.image
      ? `${apis.serverpath1}public/images/${companySettingData.image}`
      : TumbnailImage;

    doc.addImage(img, "JPEG", 12, 12, 50, 30, "overlogo", "FAST", 0);
    companyDetailsX = 80;
  } else {
    companyDetailsX = 80;
  }
  doc.text(`${name}`, 80, 55);

  const companyName = companySettingData.companyName
    ? `${companySettingData.companyName + ","}`
    : "";
  const address1 = companySettingData.address1
    ? `${companySettingData.address1 + ","}`
    : "";

  const pinCode = companySettingData.pinCode
    ? `Pincode: ${companySettingData.pinCode},`
    : "";
  const gstNum = companySettingData.gstin
    ? `GSTIN: ${companySettingData.gstin},`
    : "";
  const phoneNum = companySettingData.phoneNumber
    ? `PH: ${companySettingData.phoneNumber},`
    : "";
  const CIN = companySettingData.cin ? `CIN:${companySettingData.cin},` : "";

  if (companySettingData.image) {
    doc.text(companyDetailsX, 18, companyName);
    doc.setTextColor(100);
    doc.setFontSize(12);
    const splitTitle = doc.splitTextToSize(
      `${address1} ${pinCode} ${CIN} ${gstNum} ${phoneNum} `,
      110
    );
    doc.text(companyDetailsX, 23, splitTitle);
  } else {
    doc.text(companyDetailsX, 18, companyName);
    doc.setTextColor(100);
    doc.setFontSize(12);
    const splitTitle = doc.splitTextToSize(
      `${address1} ${pinCode} ${CIN} ${gstNum} ${phoneNum}`,
      180
    );
    doc.text(companyDetailsX, 25, splitTitle);
  }

  doc.autoTable({
    theme: "grid",
    columns: columns.map((col) => ({
      ...col,
      header: col.label,
      dataKey: col.path,
    })),
    body: body,
    styles: {
      font: "calibri",
      fontStyle: "normal",
    },
    startY: 60,
  });
  doc.save(fileName + ".pdf");
}
