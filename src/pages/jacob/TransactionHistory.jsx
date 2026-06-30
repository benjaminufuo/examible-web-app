import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiFileText,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiArrowLeft,
  FiFilter,
  FiShield,
  FiX,
  FiInbox,
  FiSearch,
  FiCopy,
  FiCheck,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiDownload,
  FiChevronDown,
  FiRefreshCcw,
} from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import "../../styles/dashboardCss/transaction-history.css";
import CustomSelect from "../../shared/Select/CustomSelect";
import Pagination from "../../shared/Pagination";
import { paymentApi } from "../../config/paymentApi";

const statusOptions = ["All", "Success", "Pending", "Failed"];
const dateRangeOptions = [
  "All Time",
  "Last 30 Days",
  "Last 3 Months",
  "Last 6 Months",
  "Last Year",
];
const planOptions = ["All Plans", "Monthly", "Yearly"];

const normalizeStatus = (status = "") => {
  const s = status.toLowerCase();
  if (["success", "successful", "paid"].includes(s)) return "success";
  if (["pending", "processing"].includes(s)) return "pending";
  if (["failed", "error"].includes(s)) return "failed";
  return null; // Return null for any unhandled status
};

const normalizeMethod = (method = "Card") => {
  const m = method.toLowerCase();
  console.log(m, "method");
  if (m === "bank_tranfer") return "Bank Transfer";
  if (m === "card") return "Card";
  if (m === "mobile_money") return "Mobile Money";
  if (m === "pay_with_bank") return "Pay with Bank";
  return null; // Return null for any unhandled status
};

const normalizeTransaction = (txn) => ({
  id: txn.transactionId || txn.id || "N/A",
  reference: txn.reference || "N/A",
  date: txn.createdAt || txn.date,
  plan: (txn.planName || txn.plan || "N/A").replace("Premium ", ""),
  amount: txn.amount || 0,
  currency: txn.currency || "NGN",
  paymentProvider: txn.paymentProvider || "KoraPay",
  paymentMethod: normalizeMethod(txn.paymentMethod),
  status: normalizeStatus(txn.status),
  duration: txn.duration || "N/A",
  subscriptionStatus: txn.subscriptionStatus || "N/A",
  gatewayResponse: txn.gatewayResponse || "No response recorded.",
});

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [currentPage, setCurrentPage] = useState(1);
  const [verifying, setVerifying] = useState(new Set());

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await paymentApi.getTransactionHistory();
        if (response.data?.data) {
          setTransactions(response.data.data.map(normalizeTransaction));
        }
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleVerify = useCallback(async (reference) => {
    setVerifying((prev) => new Set(prev).add(reference));
    try {
      const res = await paymentApi.verifyPayment(reference);
      if (res.data?.success) {
        toast.success(res.data.message || "Payment status updated.");
        // Refetch all transactions to get the latest list
        const freshData = await paymentApi.getTransactionHistory();
        if (freshData.data?.data) {
          setTransactions(freshData.data.data.map(normalizeTransaction));
        }
      } else {
        toast.info(res.data?.message || "Payment is still being processed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setVerifying((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reference);
        return newSet;
      });
    }
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => txn.status !== null) // Filter out transactions with null status
      .filter((txn) => {
        const query = searchQuery.toLowerCase();
        return (
          txn.id.toLowerCase().includes(query) ||
          txn.plan.toLowerCase().includes(query) ||
          txn.reference.toLowerCase().includes(query)
        );
      })
      .filter((txn) => {
        if (statusFilter === "All") return true;
        return txn.status.toLowerCase() === statusFilter.toLowerCase();
      })
      .filter((txn) => {
        if (dateFilter === "All Time") return true;
        const txnDate = new Date(txn.date);
        const now = new Date();
        let days;
        if (dateFilter === "Last 30 Days") days = 30;
        if (dateFilter === "Last 3 Months") days = 90;
        if (dateFilter === "Last 6 Months") days = 180;
        if (dateFilter === "Last Year") days = 365;
        const filterDate = new Date(now.setDate(now.getDate() - days));
        return txnDate >= filterDate;
      })
      .filter((txn) => {
        if (planFilter === "All Plans") return true;
        return txn.plan.toLowerCase().includes(planFilter.toLowerCase());
      });
  }, [transactions, searchQuery, statusFilter, dateFilter, planFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const formatCurrency = (amount, currency = "NGN") =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const totalAmountPaid = useMemo(
    () =>
      (transactions || [])
        .filter((t) => t.status === "success")
        .reduce((sum, txn) => sum + txn.amount, 0),
    [transactions],
  );

  const statCards = [
    {
      label: "Total Transactions",
      value: transactions.length,
      icon: <FiFileText />,
      tone: "info",
    },
    {
      label: "Successful",
      value: transactions.filter((t) => t.status === "success").length,
      icon: <FiCheckCircle />,
      tone: "success",
    },
    {
      label: "Pending",
      value: transactions.filter((t) => t.status === "pending").length,
      icon: <FiClock />,
      tone: "warning",
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalAmountPaid),
      icon: <FaNairaSign />,
      tone: "brand",
    },
  ];

  const StatusBadge = ({ status }) => {
    const icons = {
      success: <FiCheck />,
      pending: <FiClock />,
      failed: <FiX />,
      refunded: <FiRefreshCw />,
      cancelled: <FiXCircle />,
    };

    return (
      <div className={`txn-status-badge ${status}`}>
        {icons[status]}
        <span>{status}</span>
      </div>
    );
  };

  const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const controls = useAnimation();

    const handleCopy = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(text);
      setCopied(true);
      controls.start({ scale: [1, 1.3, 1], transition: { duration: 0.3 } });
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <motion.button
        animate={controls}
        onClick={handleCopy}
        className="txn-copy-btn"
        title="Copy to clipboard"
      >
        {copied ? <FiCheck /> : <FiCopy />}
      </motion.button>
    );
  };

  const renderTable = () => (
    <div className="txn-table-wrap">
      <table className="txn-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Date</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((txn) => (
            <tr key={txn.reference} className={`status-${txn.status}`}>
              <td className="txn-id-cell">
                <div className="txn-id-tag">
                  <span>{txn.reference}</span>
                  <CopyButton text={txn.reference} />
                </div>
              </td>
              <td>
                <div className="txn-date-cell">
                  <span>{formatDate(txn.date)}</span>
                  <small>{formatTime(txn.date)}</small>
                </div>
              </td>
              <td>{txn.plan}</td>
              <td className="txn-amount-cell">
                {formatCurrency(txn.amount, txn.currency)}
              </td>
              <td>{txn.paymentMethod}</td>
              <td className="txn-status-cell">
                <StatusBadge status={txn.status} />
                {txn.status === "pending" && (
                  <div className="txn-action-cell">
                    <button
                      className="txn-verify-btn"
                      onClick={() => handleVerify(txn.reference)}
                      disabled={verifying.has(txn.reference)}
                    >
                      {verifying.has(txn.reference) ? (
                        <ClipLoader color="currentColor" size={12} />
                      ) : (
                        <FiRefreshCcw />
                      )}
                      <span>
                        {verifying.has(txn.reference)
                          ? "Verifying..."
                          : "Verify"}
                      </span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileList = () => (
    <div className="txn-mobile-list">
      {currentTransactions.map((txn) => (
        <motion.button key={txn.id} className="txn-mobile-card">
          <div className="txn-mobile-card-header">
            <strong className="txn-mobile-amount">
              {formatCurrency(txn.amount, txn.currency)}
            </strong>
            <StatusBadge status={txn.status} />
          </div>
          <div className="txn-mobile-card-body">
            <span>{txn.plan}</span>
            <small>{formatDate(txn.date)}</small>
          </div>
          <div className="txn-mobile-card-footer">
            {txn.status === "pending" && (
              <button
                className="txn-verify-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVerify(txn.reference);
                }}
                disabled={verifying.has(txn.reference)}
              >
                {verifying.has(txn.reference) ? (
                  <ClipLoader color="currentColor" size={12} />
                ) : (
                  <FiRefreshCcw />
                )}
                <span>
                  {verifying.has(txn.reference)
                    ? "Verifying..."
                    : "Verify Status"}
                </span>
              </button>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="txn-empty-state">
      <div className="txn-empty-illustration">
        <FiInbox />
      </div>
      <h3>No Transactions Yet</h3>
      <p>You haven't made any subscription payments yet.</p>
      <button className="txn-cta-btn" onClick={() => navigate("/subscription")}>
        Explore Plans
      </button>
    </div>
  );

  const renderLoadingState = () => (
    <div className="txn-loading">
      <ClipLoader color="var(--ex-brand)" size={40} />
    </div>
  );

  return (
    <main className="txn-main">
      <motion.div
        className="pq-hero-section"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        transition={{ duration: 0.4 }}
      >
        <div className="pq-hero-content">
          <span className="pq-hero-badge">Billing Center</span>
          <h1 className="pq-hero-title">Transaction History</h1>
          <p className="pq-hero-desc">
            Review all your subscription payments and billing activities in one
            place.
          </p>
        </div>
      </motion.div>

      <section className="txn-stats-grid">
        {statCards.map((card, i) => (
          <motion.div
            className="txn-stat-card"
            key={card.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2 + i * 0.07 },
            }}
            whileHover={{
              y: -2,
              boxShadow: "0 6px 16px rgba(15, 23, 42, 0.07)",
            }}
          >
            <div className={`txn-stat-icon ${card.tone}`}>{card.icon}</div>
            <div className="txn-stat-content">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="txn-panel">
        <div className="txn-panel-header">
          <div>
            <h2>All Transactions</h2>
            <p>A complete record of your payment history.</p>
          </div>
          <div className="txn-trust-chip">
            <FiShield /> Secure & Encrypted
          </div>
        </div>

        <div className="txn-filters">
          <div className="txn-search-filter">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by ID, plan, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="select-filters">
            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              icon={<FiFilter />}
              renderLabel={(opt) => (opt === "All" ? "All Statuses" : `${opt}`)}
            />
            <CustomSelect
              options={dateRangeOptions}
              value={dateFilter}
              onChange={setDateFilter}
              icon={<FiCalendar />}
              renderLabel={(opt) => opt}
            />
            <CustomSelect
              options={planOptions}
              value={planFilter}
              onChange={setPlanFilter}
              icon={<FiCreditCard />}
              renderLabel={(opt) => opt}
            />
          </div>
        </div>

        {loading ? (
          renderLoadingState()
        ) : filteredTransactions.length > 0 ? (
          <>
            {renderTable()}
            {renderMobileList()}
          </>
        ) : (
          renderEmptyState()
        )}

        {totalPages > 1 && (
          <div className="txn-pagination-container">
            <Pagination
              page={currentPage}
              setPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default TransactionHistory;
