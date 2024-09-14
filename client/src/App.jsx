import { useState } from 'react';
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ImageInput from './components/FileDrop/selectedImage';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expression, setExpression] = useState("smiling");
  const [generatedImage, setGeneratedImage] = useState(null);


  // Handle expression change
  const handleExpressionChange = (e) => {
    setExpression(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload an image!");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("expression", expression);
    try {

      const response = await fetch("http://localhost:5000/generate-expression", {
        method: "POST",
        body: formData,
      });
      // const rawData = await response.text();
      // console.log(rawData);
      const data = await response.json();
      setGeneratedImage(data.imageUrl); // Assuming the backend returns an image URL
    }
    catch (err) {
      console.log('client error: ' + err.message)
    }
    finally {
      setIsLoading(false)
    }
  };

  return (
    <div className='bg-[#F0F0F0] relative h-screen flex flex-col'>
      <Navbar />

      <div className='w-full flex flex-col mt-24 gap-y-4 '>
        <h1 className='text-black text-2xl font-bold text-center'>Generate Character Expressions</h1>
        <form onSubmit={handleSubmit}>
          <ImageInput setSelectFile={setSelectedFile} />
          <select className='flex justify-center items-end mx-auto p-4 w-[20%] mt-12' value={expression} onChange={handleExpressionChange}>
            <option value="smiling">Smiling</option>
            <option value="laughing">Laughing</option>
            <option value="surprised">Surprised</option>
            <option value="sad">Sad</option>
            <option value="mad">Mad</option>
            <option value="afraid">Afraid</option>
          </select>
          <button className={"mx-auto mt-8 bg-black rounded-xl text-white flex justify-center items-center p-4"} type="submit">{isLoading?'Loading...':'Generate Image'}</button>
        </form>

        {generatedImage && (
          <div>
            <h2>Generated Image</h2>
            <img src={generatedImage} alt="Generated Expression" />
          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}

export default App
