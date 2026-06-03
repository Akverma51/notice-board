import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function AddNotice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: "",
      category: "General",
      priority: "Normal",
      publishDate: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const result = await res.json();
        setServerError(result.error || "Something went wrong");
      }
    } catch (error) {
      setServerError("Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Notice</h1>
        <Link href="/">View All</Link>
      </div>

      {serverError && (
        <p className="text-red-500 mb-4">{serverError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <div>
          <label>Title *</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Body */}
        <div>
          <label>Body *</label>
          <textarea
            rows="4"
            className="w-full p-2 border rounded"
            {...register("body", {
              required: "Body is required",
              minLength: {
                value: 10,
                message: "Body must be at least 10 characters",
              },
            })}
          />
          {errors.body && (
            <p className="text-red-500 text-sm">
              {errors.body.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label>Category *</label>
          <select
            className="w-full p-2 border rounded"
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>

          {errors.category && (
            <p className="text-red-500 text-sm">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label>Priority *</label>

          <div className="flex gap-4 mt-2">
            <label>
              <input
                type="radio"
                value="Normal"
                {...register("priority", {
                  required: "Priority is required",
                })}
              />
              Normal
            </label>

            <label>
              <input
                type="radio"
                value="Urgent"
                {...register("priority", {
                  required: "Priority is required",
                })}
              />
              Urgent
            </label>
          </div>

          {errors.priority && (
            <p className="text-red-500 text-sm">
              {errors.priority.message}
            </p>
          )}
        </div>

        {/* Publish Date */}
        <div>
          <label>Publish Date *</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            {...register("publishDate", {
              required: "Publish date is required",
              validate: (value) =>
                !isNaN(Date.parse(value)) || "Invalid date",
            })}
          />

          {errors.publishDate && (
            <p className="text-red-500 text-sm">
              {errors.publishDate.message}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label>Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border rounded"
            {...register("imageUrl", {
              pattern: {
                value:
                  /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
                message: "Enter a valid image URL",
              },
            })}
          />

          {errors.imageUrl && (
            <p className="text-red-500 text-sm">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Saving..." : "Create Notice"}
        </button>
      </form>
    </div>
  );
}