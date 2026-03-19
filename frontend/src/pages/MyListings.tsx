import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config/constants";
import { Button } from "../components/ui/Button";
import { Home, Edit2, Trash2, Eye, PlusCircle, MapPin } from "lucide-react";

const MyListings = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMyListings = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/listings/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(response.data);
    } catch (error) {
      console.error("Failed to fetch listings", error);
      setError(t("failed_load_listings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyListings();
  }, [token]);

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(deleteConfirm.id);
    try {
      await axios.delete(`${API_BASE_URL}/listings/${deleteConfirm.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(listings.filter((l) => l.id !== deleteConfirm.id));
      setSuccess(t("listing_deleted_success"));
      setDeleteConfirm(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Failed to delete listing", error);
      setError(error.response?.data?.message || t("failed_delete_listing"));
      setDeleteConfirm(null);
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        {t("loading")}
      </div>
    );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-xl bg-green-50 border-l-4 border-green-500 p-4 animate-fadeInUp dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-green-500"></div>
              <p className="text-green-700 dark:text-green-400 font-medium">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border-l-4 border-red-500 p-4 animate-fadeInUp dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-red-500"></div>
              <p className="text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-fadeInUp">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("delete_listing_title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("delete_listing_confirm", { title: deleteConfirm.title })}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting === deleteConfirm.id}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleConfirmDelete}
                  disabled={deleting === deleteConfirm.id}
                >
                  {deleting === deleteConfirm.id ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      {t("deleting")}
                    </div>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("delete")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("my_listings_title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("my_listings_desc")}
            </p>
          </div>
          <Link to="/listings/create">
            <Button variant="gradient" size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              {t("add_new_listing")}
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center p-12 text-center rounded-3xl animate-fadeInUp stagger-1">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Home className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {t("no_listings_yet")}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-xs">
              {t("no_listings_yet_desc")}
            </p>
            <Link to="/listings/create">
              <Button variant="outline">{t("post_first_listing")}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="glass card-hover group flex flex-col overflow-hidden rounded-3xl animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      listing.images[0]?.url || "https://picsum.photos/400/200"
                    }
                    alt={listing.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold border ${
                      listing.status === "ACTIVE"
                        ? "bg-green-500/90 text-white border-green-400"
                        : "bg-yellow-500/90 text-white border-yellow-400"
                    }`}
                  >
                    {listing.status === "ACTIVE" ? t("status_active") : t("status_inactive")}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                      {listing.title}
                    </h3>
                    <span className="text-indigo-600 font-bold">
                      {listing.price} {t("egp")}
                    </span>
                  </div>
                  <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{listing.address}</span>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-4 border-t dark:border-gray-700">
                    <Link to={`/listings/${listing.id}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">
                        <Eye className="mr-1 h-4 w-4" /> {t("view")}
                      </Button>
                    </Link>
                    <Link to={`/listings/edit/${listing.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        handleDeleteClick(listing.id, listing.title)
                      }
                      disabled={deleting === listing.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
