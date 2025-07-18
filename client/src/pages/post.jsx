import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';
import { getRandomPrompt } from '../constants';
import { useAuth } from '../context/AuthContext';
const BASE_URL = "https://canvascrafter-oezs.onrender.com";

const Post = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      alert('⚠️ Please log in to generate and share images.');
      navigate('/login');
      window.scrollTo(0, 0);
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.prompt || !form.photo) {
      return alert('Please enter a prompt and generate an image first.');
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/api/v1/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Post shared successfully!');
        navigate('/');
      } else if (response.status === 409) {
        alert('⚠️ This image has already been shared.');
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!form.prompt.trim()) return alert('Please enter a prompt');

    try {
      setGeneratingImg(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/api/v1/dalle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setForm({ ...form, photo: data.photo });
      } else {
        alert('Failed to generate image: ' + data.message);
      }
    } catch (err) {
      alert('Failed to generate image: ' + err.message);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSurprisePrompt = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
  <div className="relative min-h-screen w-full overflow-hidden">
    

    {/* 🧾 Main Content */}
    <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-8 py-10">
      <div className="max-w-3xl w-full">
        <h1 className="font-extrabold text-4xl text-gray-800 dark:text-white mb-2">Create</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          Generate imaginative and visually stunning images through AI and share them with the community.
        </p>

        <form
          className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
            disabled
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A panda riding a bicycle through Times Square"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurprisePrompt}
          />

          <div className="relative bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg w-64 h-64 flex items-center justify-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-gray-400">Image preview will appear here</span>
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-10 bg-white bg-opacity-70 flex justify-center items-center rounded-lg">
                <Loader />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={generateImage}
              disabled={!user}
              className={`bg-green-600 text-white font-medium px-4 py-2 rounded-md transition ${
                !user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              Generate
            </button>
            <button
              type="submit"
              disabled={!user}
              className={`bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition ${
                !user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              Share with Community
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};
export default Post;
