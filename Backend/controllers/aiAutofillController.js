import Medicine from '../models/medicine.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Function to generate AI content using OpenAI
export const generateAIContent = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate medical information about pharmaceutical products.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    throw new Error('Failed to generate AI content');
  }
};

// Controller to autofill medicine details
export const autofillMedicineDetails = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { fields = [] } = req.body; // Array of fields to autofill (e.g., ['description', 'sideEffects'])

    if (!medicineId || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Medicine ID and fields array are required'
      });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    const updates = {};
    const updatesMade = [];

    for (const field of fields) {
      try {
        let prompt = '';
        let updatePath = '';
        let isArray = false;

        // Define prompts for different fields
        const fieldInfo = field.split('.');
        const mainField = fieldInfo[0];
        const subField = fieldInfo[1];
        
        // Helper function to get medicine info for prompts
        const getMedicineInfo = () => {
          let info = `medicine "${medicine.productName}"`;
          if (medicine.genericName) info += ` (generic name: ${medicine.genericName})`;
          if (medicine.manufacturer) info += ` by ${medicine.manufacturer}`;
          if (medicine.composition?.activeIngredients?.length) {
            info += ` containing ${medicine.composition.activeIngredients.join(', ')}`;
          }
          return info;
        };

        switch (field) {
          // Basic Information
          case 'description':
            prompt = `Generate a comprehensive description for ${getMedicineInfo()}. Include its uses, mechanism of action, and key benefits in a professional medical tone.`;
            updatePath = 'description';
            break;

          case 'genericName':
            prompt = `Provide the generic name (non-proprietary name) for the medicine commonly known as "${medicine.productName}". 
                     Return only the name without any additional text.`;
            updatePath = 'genericName';
            break;

          case 'category':
            prompt = `Categorize ${getMedicineInfo()} into one of these categories: OTC, Prescription, Ayurvedic, or Homeopathic. 
                     Return only the category name without any additional text.`;
            updatePath = 'category';
            break;

          // Composition
          case 'composition.activeIngredients':
            prompt = `List the active ingredients in ${getMedicineInfo()} in a JSON array format. 
                     Return only the array without any additional text.`;
            updatePath = 'composition.activeIngredients';
            isArray = true;
            break;

          case 'composition.inactiveIngredients':
            prompt = `List the inactive/excipient ingredients in ${getMedicineInfo()} in a JSON array format. 
                     Return only the array without any additional text.`;
            updatePath = 'composition.inactiveIngredients';
            isArray = true;
            break;

          // Dosage
          case 'dosage.form':
            prompt = `What is the dosage form of ${getMedicineInfo()}? (e.g., tablet, capsule, syrup, injection). 
                     Return only the form without any additional text.`;
            updatePath = 'dosage.form';
            break;

          case 'dosage.strength':
            prompt = `What is the strength of ${getMedicineInfo()}? (e.g., 500mg, 10mg/5ml). 
                     Return only the strength without any additional text.`;
            updatePath = 'dosage.strength';
            break;

          case 'dosage.recommendedDosage':
            prompt = `Provide the recommended dosage for ${getMedicineInfo()}. Include frequency and duration if applicable. 
                     Be concise and professional.`;
            updatePath = 'dosage.recommendedDosage';
            break;

          // Packaging
          case 'packaging.packSize':
            prompt = `What is the standard pack size for ${getMedicineInfo()}? (e.g., 10 tablets, 100ml bottle). 
                     Return only the pack size without additional text.`;
            updatePath = 'packaging.packSize';
            break;

          case 'packaging.storageInstructions':
            prompt = `Provide proper storage instructions for ${getMedicineInfo()}. 
                     Be concise and professional.`;
            updatePath = 'packaging.storageInstructions';
            break;

          // Regulatory
          case 'regulatory.drugType':
            prompt = `What type of drug is ${getMedicineInfo()}? (e.g., antibiotic, analgesic, antihypertensive). 
                     Return only the type without additional text.`;
            updatePath = 'regulatory.drugType';
            break;

          case 'regulatory.sideEffects':
            prompt = `List the most common side effects of ${getMedicineInfo()} in a JSON array format. 
                     Return only the array without any additional text.`;
            updatePath = 'regulatory.sideEffects';
            isArray = true;
            break;

          case 'regulatory.warnings':
            prompt = `List important warnings and precautions for ${getMedicineInfo()} in a JSON array format. 
                     Return only the array without any additional text.`;
            updatePath = 'regulatory.warnings';
            isArray = true;
            break;

          case 'regulatory.contraindications':
            prompt = `List contraindications for ${getMedicineInfo()} in a JSON array format. 
                     Return only the array without any additional text.`;
            updatePath = 'regulatory.contraindications';
            isArray = true;
            break;

          case 'regulatory.interactions':
            prompt = `List potential drug interactions for ${getMedicineInfo()} in a JSON array format. 
                     Return only the array without any additional text.`;
            updatePath = 'regulatory.interactions';
            isArray = true;
            break;

          // Additional Features
          case 'additionalFeatures.doctorAdvice':
            prompt = `Provide professional medical advice for patients taking ${getMedicineInfo()}. 
                     Include important usage instructions and when to consult a doctor.`;
            updatePath = 'additionalFeatures.doctorAdvice';
            break;

          case 'additionalFeatures.faqs':
            prompt = `Generate 3-5 common questions and answers about ${getMedicineInfo()} in JSON format: 
                     [{"question": "...", "answer": "..."}]. Return only the JSON array.`;
            updatePath = 'additionalFeatures.faqs';
            isArray = true;
            break;

          default:
            console.warn(`Unsupported field for autofill: ${field}`);
            continue;
        }

        // Generate content using OpenAI
        const content = await generateAIContent(prompt);
        
        // Parse the response if it's supposed to be an array
        let processedContent = content;
        if (isArray) {
          try {
            // Try to parse JSON array from the response
            const jsonMatch = content.match(/\[.*\]/s);
            if (jsonMatch) {
              processedContent = JSON.parse(jsonMatch[0]);
            } else {
              // If not a proper JSON array, split by newlines and clean up
              processedContent = content
                .split('\n')
                .map(item => item.replace(/^[-•*]\s*|\d+\.\s*/g, '').trim())
                .filter(item => item.length > 0);
            }
          } catch (error) {
            console.error(`Error parsing array response for ${field}:`, error);
            continue;
          }
        }

        // Set the update object
        const pathParts = updatePath.split('.');
        if (pathParts.length === 1) {
          updates[pathParts[0]] = processedContent;
        } else if (pathParts.length === 2) {
          updates[pathParts[0]] = updates[pathParts[0]] || {};
          updates[pathParts[0]][pathParts[1]] = processedContent;
        }

        updatesMade.push(field);
      } catch (error) {
        console.error(`Error processing field ${field}:`, error);
        // Continue with next field even if one fails
      }
    }

    // Update the medicine if we have any updates
    if (Object.keys(updates).length > 0) {
      Object.assign(medicine, updates);
      await medicine.save();
    }

    res.status(200).json({
      success: true,
      message: `Successfully autofilled ${updatesMade.length} fields`,
      updatedFields: updatesMade,
      data: medicine
    });

  } catch (error) {
    console.error('Error in autofillMedicineDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Controller to get available fields for autofill
// Controller to autofill and update medicine information in one step
export const autofillAndUpdateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;

    if (!id || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Medicine ID and fields array are required'
      });
    }

    // First, get the medicine
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Create a new response object to capture the response from autofillMedicineDetails
    const autofillRes = {
      json: function(data) {
        // If autofill was successful, update the medicine
        if (data && data.success) {
          // The medicine is already saved in the autofill function
          res.status(200).json({
            success: true,
            message: `Successfully autofilled and updated ${data.updatedFields.length} fields`,
            updatedFields: data.updatedFields,
            data: data.data || medicine
          });
        } else {
          throw new Error(data?.message || 'Failed to autofill fields');
        }
      },
      status: function(code) {
        this.statusCode = code;
        return this;
      }
    };
    
    // Call autofillMedicineDetails with the proper request and response objects
    await autofillMedicineDetails(
      { params: { medicineId: id }, body: { fields } },
      autofillRes,
      (error) => {
        if (error) {
          throw error;
        }
      }
    );
  } catch (error) {
    console.error('Error in autofillAndUpdateMedicine:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getAutofillOptions = (req, res) => {
  try {
    const options = [
      // General Information
      { id: 'description', label: 'Description', category: 'General' },
      { id: 'genericName', label: 'Generic Name', category: 'Basic Information' },
      { id: 'category', label: 'Category', category: 'Basic Information' },
      
      // Composition
      { id: 'composition.activeIngredients', label: 'Active Ingredients', category: 'Composition' },
      { id: 'composition.inactiveIngredients', label: 'Inactive Ingredients', category: 'Composition' },
      
      // Dosage
      { id: 'dosage.form', label: 'Dosage Form', category: 'Dosage' },
      { id: 'dosage.strength', label: 'Dosage Strength', category: 'Dosage' },
      { id: 'dosage.recommendedDosage', label: 'Recommended Dosage', category: 'Dosage' },
      
      // Packaging
      { id: 'packaging.packSize', label: 'Pack Size', category: 'Packaging' },
      { id: 'packaging.storageInstructions', label: 'Storage Instructions', category: 'Packaging' },
      
      // Regulatory
      { id: 'regulatory.drugType', label: 'Drug Type', category: 'Regulatory' },
      { id: 'regulatory.sideEffects', label: 'Side Effects', category: 'Regulatory' },
      { id: 'regulatory.warnings', label: 'Warnings', category: 'Regulatory' },
      { id: 'regulatory.contraindications', label: 'Contraindications', category: 'Regulatory' },
      { id: 'regulatory.interactions', label: 'Drug Interactions', category: 'Regulatory' },
      
      // Additional Features
      { id: 'additionalFeatures.doctorAdvice', label: 'Doctor\'s Advice', category: 'Additional' },
      { id: 'additionalFeatures.faqs', label: 'FAQs', category: 'Additional' }
    ];

    res.status(200).json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Error in getAutofillOptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
