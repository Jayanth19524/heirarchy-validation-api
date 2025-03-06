import { OrgChartUpload } from "../models/OrgChartUpload.js";

export const getAllOrgCharts = async (req, res) => {
  try {
    const orgCharts = await OrgChartUpload.find(); // Fetch all documents
    res.json({ count: orgCharts.length, orgCharts });
  } catch (error) {
    console.error("Error fetching org charts:", error);
    res.status(500).json({ error: "Error fetching organization charts" });
  }
};
export const getOrgChartByData = async (req, res) => {
    try {
      const searchField = req.query.field; // Example: "employeeName"
      const searchValue = req.query.value; // Example: "John Doe"
  
      if (!searchField || !searchValue) {
        return res.status(400).json({ error: "Missing search field or value" });
      }
  
      // Find documents where `data` contains an object with the given field-value pair
      const results = await OrgChartUpload.find({
        [`data.${searchField}`]: searchValue,
      });
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No matching records found" });
      }
  
      res.json({ count: results.length, results });
    } catch (error) {
      console.error("Error searching org charts:", error);
      res.status(500).json({ error: "Error searching organization charts" });
    }
  };
  export const getOrgChartById = async (req, res) => {
    try {
      const { id } = req.params;
      const orgChart = await OrgChartUpload.findById(id);
  
      if (!orgChart) {
        return res.status(404).json({ error: "OrgChart not found" });
      }
  
      res.json(orgChart);
    } catch (error) {
      console.error("Error fetching org chart by ID:", error);
      res.status(500).json({ error: "Error retrieving the organization chart" });
    }
  };
    