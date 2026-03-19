import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../config/constants";
import { Button } from "../components/ui/Button";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  ChevronRight,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Flag,
  Eye,
  MessageSquare,
  Share2,
  Download,
  Filter,
  Send,
  Inbox,
} from "lucide-react";

const MyVisits = () => {
  const { token, user } = useAuth();
  const { t, i18n } = useTranslation();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [fillterStatus, setFilterStatus] = useState<string>("all");
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    visitId: string | null;
    reason: string;
  }>({
    isOpen: false,
    visitId: null,
    reason: "",
  });

  const fetchVisits = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/visits?type=sent`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/visits?type=received`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setVisits([...sentRes.data, ...receivedRes.data]);
    } catch (error) {
      console.error("Failed to fetch visits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchVisits();
  }, [token]);

  const handleStatusUpdate = async (
    visitId: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    try {
      const endpoint = status === "ACCEPTED" ? "accept" : "decline";
      await axios.post(
        `${API_BASE_URL}/visits/${visitId}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchVisits();
    } catch (error) {
      console.error("Failed to update visit status", error);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportModal.visitId || !reportModal.reason.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/visits/${reportModal.visitId}/report`,
        { reason: reportModal.reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReportModal({ isOpen: false, visitId: null, reason: "" });
      alert(t("report_submitted_success") || "تم الإبلاغ بنجاح");
    } catch (error) {
      console.error("Failed to submit report", error);
      alert(t("report_submitted_error") || "فشل الإبلاغ");
    }
  };

  const sentVisits = visits.filter((v) => v.requesterId === user?.id);
  const receivedVisits = visits.filter((v) => v.ownerId === user?.id);

  let displayVisits = activeTab === "sent" ? sentVisits : receivedVisits;

  if (fillterStatus !== "all") {
    displayVisits = displayVisits.filter(
      (v) => v.status.toLowerCase() === fillterStatus.toLowerCase(),
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        {t("loading")}
      </div>
    );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
      <div className="container max-w-5xl px-4 mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text">
                {t("my_visits")}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t("manage_your_visit_requests")}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {i18n.language === "ar" ? "العربية" : "English"}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 p-2 mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-900/50 rounded-2xl dark:border-gray-800 backdrop-blur-sm">
            <button
              onClick={() => {
                setActiveTab("sent");
                setFilterStatus("all");
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "sent"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Send className="w-4 h-4" />
              {t("sent_requests")} ({sentVisits.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("received");
                setFilterStatus("all");
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "received"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Inbox className="w-4 h-4" />
              {t("received_requests")} ({receivedVisits.length})
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("filter") || "Filter"}
              </span>
            </div>
            {["all", "REQUESTED", "ACCEPTED", "DECLINED"].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(status === "all" ? "all" : status)
                }
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  fillterStatus === status
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-400"
                }`}
              >
                {status === "all"
                  ? t("all")
                  : t(`status_${status.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {displayVisits.length === 0 ? (
          <div className="py-16">
            <div className="relative p-12 text-center border-2 border-gray-300 border-dashed glass rounded-3xl dark:border-gray-700 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-transparent to-blue-100/20 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-3xl" />
              <div className="relative">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
                  <Calendar className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                  {t("no_visits_found")}
                </h3>
                <p className="max-w-sm mx-auto mb-6 text-gray-600 dark:text-gray-400">
                  {t("no_visits_desc")}
                </p>
                <a href="/listings">
                  <Button variant="gradient" size="sm">
                    {t("browse_listings") || "استكشف الإعلانات"}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {displayVisits.map((visit) => (
              <div
                key={visit.id}
                className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 group dark:bg-gray-900/50 rounded-2xl hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 dark:border-gray-800 backdrop-blur-sm hover:-translate-y-1"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-blue-50/30 dark:from-indigo-900/10 dark:via-transparent dark:to-blue-900/10 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Listing Image */}
                    <div className="flex-shrink-0 w-full overflow-hidden transition-shadow duration-300 shadow-md md:w-36 h-28 rounded-2xl group-hover:shadow-lg">
                      <img
                        src={
                          visit.listing?.images?.[0]?.url ||
                          "https://picsum.photos/200/200"
                        }
                        alt={visit.listing?.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-4 mb-4 md:flex-row md:items-start">
                        <div className="flex-1">
                          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {visit.listing?.title}
                          </h3>

                          {/* Status Badge */}
                          <div className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 bg-gradient-to-r shadow-sm">
                            {visit.status === "REQUESTED" && (
                              <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                                <Clock className="w-3 h-3 animate-pulse" />
                                {t("status_requested")}
                              </div>
                            )}
                            {visit.status === "ACCEPTED" && (
                              <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                <CheckCircle className="w-3 h-3" />
                                {t("status_accepted")}
                              </div>
                            )}
                            {visit.status === "DECLINED" && (
                              <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                <XCircle className="w-3 h-3" />
                                {t("status_declined")}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Menu Button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === visit.id ? null : visit.id,
                              )
                            }
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-200 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 flex items-center justify-center"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenu === visit.id && (
                            <div className="absolute right-0 z-50 w-48 mt-2 overflow-hidden bg-white border border-gray-100 shadow-2xl dark:bg-gray-800 rounded-xl dark:border-gray-700">
                              <button
                                onClick={() => {
                                  setExpandedContact(
                                    expandedContact === visit.id
                                      ? null
                                      : visit.id,
                                  );
                                  setActiveMenu(null);
                                }}
                                className="flex items-center w-full gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:border-gray-700"
                              >
                                <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {expandedContact === visit.id
                                    ? t("hide_contact") || "إخفاء التفاصيل"
                                    : t("show_contact") || "عرض التفاصيل"}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  setReportModal({
                                    isOpen: true,
                                    visitId: visit.id,
                                    reason: "",
                                  });
                                  setActiveMenu(null);
                                }}
                                className="flex items-center w-full gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 hover:bg-red-50 dark:hover:bg-red-900/30 dark:border-gray-700"
                              >
                                <Flag className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {t("report_listing") || "الإبلاغ"}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  navigator.share?.({
                                    title: visit.listing?.title,
                                    text: `${t("check_this_listing") || "تحقق من هذا الإعلان"}: ${visit.listing?.title}`,
                                  });
                                  setActiveMenu(null);
                                }}
                                className="flex items-center w-full gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:border-gray-700"
                              >
                                <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {t("share") || "مشاركة"}
                                </span>
                              </button>

                              <button
                                className="flex items-center w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/30"
                                onClick={() => {
                                  const data = JSON.stringify(visit, null, 2);
                                  const element = document.createElement("a");
                                  element.setAttribute(
                                    "href",
                                    "data:text/plain;charset=utf-8," +
                                      encodeURIComponent(data),
                                  );
                                  element.setAttribute(
                                    "download",
                                    `visit-${visit.id}.json`,
                                  );
                                  element.style.display = "none";
                                  document.body.appendChild(element);
                                  element.click();
                                  document.body.removeChild(element);
                                  setActiveMenu(null);
                                }}
                              >
                                <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {t("download") || "تحميل"}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium">
                            {new Date(visit.visitDate).toLocaleDateString(
                              i18n.language === "ar" ? "ar-SA" : "en-US",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium">
                            {activeTab === "sent"
                              ? visit.listing?.owner?.fullName || "Owner"
                              : visit.requester?.fullName || "Requester"}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      {visit.message && (
                        <div className="px-4 py-3 mb-4 border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800/50 rounded-xl">
                          <p className="text-sm italic text-gray-700 dark:text-gray-300">
                            <MessageSquare className="inline w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                            "{visit.message}"
                          </p>
                        </div>
                      )}

                      {/* Expanded Contact Info */}
                      {expandedContact === visit.id && (
                        <div className="p-4 mb-4 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 dark:border-indigo-800/50 rounded-xl">
                          <h4 className="flex items-center gap-2 mb-3 font-bold text-gray-900 dark:text-white">
                            <User className="w-4 h-4 text-indigo-600" />
                            {t("contact_information") || "معلومات الاتصال"}
                          </h4>
                          <div className="space-y-2 text-sm">
                            {activeTab === "sent" ? (
                              <>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                  <User className="w-4 h-4 text-indigo-600" />
                                  <span>{visit.listing?.owner?.fullName}</span>
                                </div>
                                {visit.listing?.owner?.phone && (
                                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <a
                                      href={`tel:${visit.listing?.owner?.phone}`}
                                      className="font-medium text-green-600 dark:text-green-400 hover:underline"
                                    >
                                      {visit.listing?.owner?.phone}
                                    </a>
                                  </div>
                                )}
                                {visit.listing?.owner?.email && (
                                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <a
                                      href={`mailto:${visit.listing?.owner?.email}`}
                                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      {visit.listing?.owner?.email}
                                    </a>
                                  </div>
                                )}
                                {visit.listing?.location && (
                                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 text-orange-600" />
                                    <span>{visit.listing?.location}</span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                  <User className="w-4 h-4 text-indigo-600" />
                                  <span>{visit.requester?.fullName}</span>
                                </div>
                                {visit.requester?.phone && (
                                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <a
                                      href={`tel:${visit.requester?.phone}`}
                                      className="font-medium text-green-600 dark:text-green-400 hover:underline"
                                    >
                                      {visit.requester?.phone}
                                    </a>
                                  </div>
                                )}
                                {visit.requester?.email && (
                                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <a
                                      href={`mailto:${visit.requester?.email}`}
                                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      {visit.requester?.email}
                                    </a>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {activeTab === "received" &&
                          visit.status === "REQUESTED" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(visit.id, "ACCEPTED")
                                }
                                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {t("accept_visit") || "قبول"}
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusUpdate(visit.id, "REJECTED")
                                }
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                {t("reject_visit") || "رفض"}
                              </button>
                            </>
                          )}

                        <a
                          href={`/listings/${visit.listing?.id}`}
                          className="flex-1 sm:flex-none"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t("view_listing") || "عرض الإعلان"}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Report Modal */}
        {reportModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 transition-all transform bg-white border border-gray-200 shadow-2xl dark:bg-gray-900 rounded-3xl dark:border-gray-800">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {t("report_listing") || "الإبلاغ عن الإعلان"}
              </h3>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                {t("report_description") ||
                  "يرجى شرح سبب إبلاغك عن هذا الإعلان"}
              </p>

              <textarea
                value={reportModal.reason}
                onChange={(e) =>
                  setReportModal({ ...reportModal, reason: e.target.value })
                }
                placeholder={t("report_reason_placeholder") || "أدخل السبب..."}
                className="w-full h-32 px-4 py-3 mb-6 border border-gray-300 resize-none dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setReportModal({ isOpen: false, visitId: null, reason: "" })
                  }
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t("cancel") || "إلغاء"}
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  {t("submit_report") || "إرسال"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVisits;
