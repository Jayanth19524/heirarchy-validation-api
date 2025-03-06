import { OrgChartUpload } from "../models/OrgChartUpload.js";
export const saveOrgChartUpload = async (data, errors) => {
    try {
      // Check if MongoDB has space (optional: estimate based on collection size)
      const totalDocs = await OrgChartUpload.estimatedDocumentCount();
      
      if (totalDocs >= 100000) {  // Adjust this number based on average document size
        console.warn("⚠️ MongoDB storage limit reached, skipping save");
        return { message: "Storage full, file processed but not saved", errors };
      }
  
      const savedRecord = await OrgChartUpload.create({ message: "File processed successfully",data, errors });
      return savedRecord;
    } catch (error) {
      if (error.code === 11000 || error.message.includes("quota exceeded")) {
        console.warn("⚠️ MongoDB storage full, unable to save");
        return { message: "Storage full, file processed but not saved", errors };
      }
      throw error; // Re-throw other errors
    }
  };
  

