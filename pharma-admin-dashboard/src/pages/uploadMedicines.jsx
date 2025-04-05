import { useContext, useState, useRef } from 'react';
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { BASE_URL } from '../config';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import UploadMed from '../assets/uploadMedicine.png';
import uploadToCloudinary from '../utils/uploadToCloudinary';

function UploadMedicine() {
  const { token } = useContext(AuthContext);

  const [medicineData, setMedicineData] = useState({
    medImg: '',
    brandName: '',
    genericName: '',
    dosageForm: '',
    strength: '',
    batchNumber: '',
    expiryDate: '',
    manufacturingDate: '',
    storageInstructions: '',
    price: '',
    directionsForUse: '',
    warningsAndPrecautions: '',
    contraindications: '',
    ingredients: [],
    manufacturer: {
      name: '',
      address: '',
    },
    registrationNumber: '',
    barcode: '',
  });

  const bannerRef = useRef();

  const handleChange = (field, value) => {
    setMedicineData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleManufacturerChange = (key, value) => {
    setMedicineData(prev => ({
      ...prev,
      manufacturer: {
        ...prev.manufacturer,
        [key]: value,
      }
    }));
  };

  const handleBannerUpload = async (e) => {
    const toastLoading = toast.loading('Uploading Image...');
    try {
      const file = e.target.files[0];
      const data = await uploadToCloudinary(file);
      if (data) {
        toast.dismiss(toastLoading);
        handleChange('medImg', data.secure_url);
        bannerRef.current.src = data.secure_url;
        toast.success('Uploaded ✅');
      }
    } catch (err) {
      toast.dismiss(toastLoading);
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/medicines/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(medicineData),
      });

      const { message } = await res.json();
      if (!res.ok) throw new Error(message);

      toast.success("Medicine Added Successfully");

      setMedicineData({
        medImg: '',
        brandName: '',
        genericName: '',
        dosageForm: '',
        strength: '',
        batchNumber: '',
        expiryDate: '',
        manufacturingDate: '',
        storageInstructions: '',
        price: '',
        directionsForUse: '',
        warningsAndPrecautions: '',
        contraindications: '',
        ingredients: [],
        manufacturer: { name: '', address: '' },
        registrationNumber: '',
        barcode: '',
      });

      bannerRef.current.src = UploadMed;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderInput = (label, field, value, type = "text", onChange = handleChange) => (
    <div className="mb-4 px-4 w-full sm:w-1/2">
      <div className="mb-1 flex flex-col gap-6">
        <Typography variant="h6" color="blue-gray" className="-mb-3">
          {label}
        </Typography>
        <Input
          type={type}
          size="lg"
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => onChange(field, type === "date" ? e.target.value : e.target.value)}
          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </div>
    </div>
  );

  return (
    <Card color="transparent" shadow={false} className='w-full'>
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Upload Medicine
      </Typography>

      <form className="mb-8" onSubmit={handleSubmit}>
        {/* Upload Image Section */}
        <div className="flex items-center gap-6 mb-10">
          <label htmlFor="uploadBanner" className="cursor-pointer">
            <Typography variant="h6" className="rounded-full px-6 py-2 bg-black text-white text-center">
              Upload Image
            </Typography>
            <input
              id="uploadBanner"
              type="file"
              accept=".png,.jpeg,.jpg"
              hidden
              onChange={handleBannerUpload}
            />
          </label>
          <img
            src={medicineData.medImg || UploadMed}
            ref={bannerRef}
            alt="Uploaded medicine"
            className="w-40 h-40 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Form Inputs */}
        <div className="flex flex-wrap mx-4 w-[67vw]">
          {renderInput("Brand Name", "brandName", medicineData.brandName)}
          {renderInput("Generic Name", "genericName", medicineData.genericName)}
          {renderInput("Dosage Form", "dosageForm", medicineData.dosageForm)}
          {renderInput("Strength", "strength", medicineData.strength)}
          {renderInput("Batch Number", "batchNumber", medicineData.batchNumber)}
          {renderInput("Expiry Date", "expiryDate", medicineData.expiryDate, "date")}
          {renderInput("Manufacturing Date", "manufacturingDate", medicineData.manufacturingDate, "date")}
          {renderInput("Price", "price", medicineData.price)}
          {renderInput("Directions for Use", "directionsForUse", medicineData.directionsForUse)}
          {renderInput("Storage Instructions", "storageInstructions", medicineData.storageInstructions)}
          {renderInput("Warnings and Precautions", "warningsAndPrecautions", medicineData.warningsAndPrecautions)}
          {renderInput("Contraindications", "contraindications", medicineData.contraindications)}
          {renderInput("Registration Number", "registrationNumber", medicineData.registrationNumber)}
          {renderInput("Barcode", "barcode", medicineData.barcode)}
          {renderInput("Manufacturer Address", "address", medicineData.manufacturer.address, "text", handleManufacturerChange)}
          {renderInput("Ingredients", "ingredients", medicineData.ingredients.join(', '), "text", (field, val) =>
            handleChange(field, val.split(',').map(item => item.trim()))
          )}
        </div>

        <div className="mt-6 w-[80%] mx-auto">
          <Button type="submit" className="bg-black text-white" fullWidth>
            Upload Medicine
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default UploadMedicine;
