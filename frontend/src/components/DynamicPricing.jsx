import React, { useState, useEffect } from "react";

const DynamicPricing = () => {
  const [pricing, setPricing] = useState({
    student: { breakfast: 30, lunch: 50, dinner: 50, special: 80 },
    guest: { breakfast: 50, lunch: 80, dinner: 80, special: 120 },
    rules: { noticeHours: 24 },
    extraPrices: {}
  });

  // Mock audit log for demonstration
  const [auditLog, setAuditLog] = useState([
    { _id: "log1", date: "2023-10-01", action: "Increased Student Lunch from ₹45 to ₹50", admin: "Jane Doe" },
    { _id: "log2", date: "2023-09-15", action: "Updated Base Mess Fee to ₹1200", admin: "System Admin" },
    { _id: "log3", date: "2023-08-01", action: "Set Guest Special Feast to ₹120", admin: "John Smith" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/pricing", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.pricing) {
            setPricing({
              ...pricing, // Preserve defaults for new fields like extraPrices if missing
              ...data.pricing
            });
          }
          if (data.auditLog) setAuditLog(data.auditLog);
        }
      } catch (error) {
        console.error("Failed to fetch pricing data:", error);
      }
    };
    fetchPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNestedChange = (category, field, value) => {
    setPricing({
      ...pricing,
      [category]: { ...pricing[category], [field]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(pricing)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.auditLog) setAuditLog(data.auditLog);
        alert("Dynamic pricing and rules updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to update pricing"}`);
      }
    } catch (error) {
      console.error("Error saving pricing:", error);
      alert("Network error occurred while saving the pricing rules.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMealIcon = (meal) => {
    switch (meal) {
      case 'breakfast': return <i className="bi bi-sunrise text-warning fs-5"></i>;
      case 'lunch': return <i className="bi bi-sun text-danger fs-5"></i>;
      case 'dinner': return <i className="bi bi-moon-stars fs-5" style={{ color: 'var(--brand-secondary)' }}></i>;
      case 'special': return <i className="bi bi-star text-success fs-5"></i>;
      default: return <i className="bi bi-cup-hot text-secondary fs-5"></i>;
    }
  };

  return (
    <>
      <style>{`
      .transition-all { transition: all 0.3s ease; }
      .hover-shadow:hover { box-shadow: var(--shadow-md) !important; }
      .hover-scale:hover { transform: translateY(-3px); }
      .hover-bg-danger:hover { background-color: #dc3545 !important; }
      .hover-text-white:hover { color: white !important; }
      .hover-bg-light:hover { background-color: #f8f9fa !important; }
      .border-dashed { border-style: dashed !important; border-width: 2px !important; }
      .hover-border-brand:hover { border-color: var(--brand-primary) !important; }
      .brand-icon-bg { background: var(--brand-gradient); color: white; }
    `}</style>
      <div className="container-fluid py-4 px-lg-4 slide-up" style={{ minHeight: "100vh" }}>

        {/* PAGE HEADER */}
        <div className="mb-5 d-flex align-items-center justify-content-between fade-in">
          <div>
            <h2 className="nav-title m-0 d-flex align-items-center" style={{ letterSpacing: "-0.5px" }}>
              <span className="brand-icon-bg p-2 rounded-3 me-3 shadow-sm d-inline-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', WebkitTextFillColor: 'white' }}>
                <i className="bi bi-hexagon-fill fs-4"></i>
              </span>
              <span className="text-gradient">Dynamic Pricing</span>
            </h2>
            <p className="text-muted mt-2 mb-0 fs-6 ms-1">Configure per-meal costs, manage billing rules, and extra item prices dynamically.</p>
          </div>
        </div>

        <div className="row g-4">

          {/* LEFT COLUMN: Main Form */}
          <div className="col-lg-8 fade-in" style={{ animationDelay: '0.1s' }}>

            {/* PRICING FORM CARD */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden bg-white">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="nav-title m-0 d-flex align-items-center text-gradient">
                  <i className="bi bi-sliders me-2" style={{ color: 'var(--brand-primary)' }}></i> Base Meal Pricing
                </h5>
                <p className="text-muted small mt-1 mb-0">Set the default rates applied to daily mess billing.</p>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="table-responsive rounded-4 border mb-4 shadow-sm">
                    <table className="table table-borderless align-middle mb-0 table-hover">
                      <thead className="bg-light border-bottom">
                        <tr>
                          <th className="text-muted fw-bold text-uppercase small py-3 ps-4" style={{ letterSpacing: "1px" }}>Meal Type</th>
                          <th className="text-muted fw-bold text-uppercase small py-3 text-center" style={{ letterSpacing: "1px" }}>Student Rate</th>
                          <th className="text-muted fw-bold text-uppercase small py-3 text-center pe-4" style={{ letterSpacing: "1px" }}>Guest Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {["breakfast", "lunch", "dinner", "special"].map((meal, index) => (
                          <tr key={meal} className={index !== 3 ? "border-bottom" : ""}>
                            <td className="fw-bold text-dark text-capitalize py-3 ps-4 d-flex align-items-center">
                              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 border" style={{ width: "42px", height: "42px" }}>
                                {getMealIcon(meal)}
                              </div>
                              <div>
                                <span className="d-block text-dark fw-bold">{meal === 'special' ? 'Sunday / Festival' : meal}</span>
                                <span className="text-muted small fw-normal">Standard {meal} timing</span>
                              </div>
                            </td>
                            <td className="py-3 px-3" style={{ width: "25%" }}>
                              <div className="input-group input-group-sm rounded-3 bg-white overflow-hidden shadow-sm transition-all">
                                <span className="input-group-text bg-white border-0 text-muted fw-bold px-3">₹</span>
                                <input type="number" className="form-control border-0 modern-input py-2 rounded-0 rounded-end"
                                  value={pricing.student[meal]} onChange={(e) => handleNestedChange('student', meal, e.target.value)} min="0" required
                                  style={{ boxShadow: "none" }} />
                              </div>
                            </td>
                            <td className="py-3 px-3 pe-4" style={{ width: "25%" }}>
                              <div className="input-group input-group-sm rounded-3 bg-white overflow-hidden shadow-sm transition-all">
                                <span className="input-group-text bg-white border-0 text-muted fw-bold px-3">₹</span>
                                <input type="number" className="form-control border-0 modern-input py-2 rounded-0 rounded-end"
                                  value={pricing.guest[meal]} onChange={(e) => handleNestedChange('guest', meal, e.target.value)} min="0" required
                                  style={{ boxShadow: "none" }} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* RULES SECTION */}
                  <div className="rounded-4 p-4 mb-5 border d-flex align-items-center justify-content-between flex-wrap gap-3 transition-all hover-shadow" style={{ backgroundColor: 'rgba(255, 81, 47, 0.05)', borderColor: 'rgba(255, 81, 47, 0.2)' }}>
                    <div>
                      <h6 className="fw-bold mb-1 d-flex align-items-center text-gradient">
                        <i className="bi bi-clock-history me-2 fs-5" style={{ color: 'var(--brand-primary)' }}></i> Minimum Rebate Notice
                      </h6>
                      <p className="small mb-0 fw-medium" style={{ color: 'var(--brand-secondary)' }}>Hours required before meal time to pause charges without penalty.</p>
                    </div>
                    <div className="input-group shadow-sm rounded-3 bg-white overflow-hidden" style={{ width: "160px" }}>
                      <input type="number" className="form-control border-0 modern-input text-center fw-bold text-dark py-2 fs-6 rounded-0 rounded-start"
                        value={pricing.rules?.noticeHours || ''} onChange={(e) => handleNestedChange('rules', 'noticeHours', e.target.value)} min="0" required style={{ boxShadow: "none" }} />
                      <span className="input-group-text bg-light border-0 text-muted fw-semibold px-3">Hrs</span>
                    </div>
                  </div>

                  {/* EXTRA ITEM PRICING SECTION */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="nav-title m-0 d-flex align-items-center">
                          <i className="bi bi-cup-hot-fill text-warning me-2"></i> À La Carte / Extra Items
                        </h6>
                        <p className="text-muted small mt-1 mb-0">Configure prices for individual add-ons.</p>
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold shadow-sm d-flex align-items-center transition-all" style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }} onClick={() => {
                        const itemName = prompt("Enter item name (e.g. Milk, Egg, Extra Paneer):");
                        if (itemName && itemName.trim() !== '') {
                          const newExtras = pricing.extraPrices ? { ...pricing.extraPrices } : {};
                          newExtras[itemName.trim()] = 0;
                          setPricing({ ...pricing, extraPrices: newExtras });
                        }
                      }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-gradient)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'transparent'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}>
                        <i className="bi bi-plus-lg me-1"></i> Add Item
                      </button>
                    </div>

                    <div className="row g-3">
                      {(!pricing.extraPrices || Object.keys(pricing.extraPrices).length === 0) && (
                        <div className="col-12 text-center py-5 bg-light rounded-4 border border-dashed">
                          <i className="bi bi-inbox text-muted fs-1 mb-3 d-block opacity-50"></i>
                          <h6 className="fw-bold text-dark mb-1">No extra items configured</h6>
                          <p className="text-muted small mb-0">Click the 'Add Item' button above to start adding à la carte items.</p>
                        </div>
                      )}
                      {pricing.extraPrices && Object.entries(pricing.extraPrices).map(([item, price]) => (
                        <div key={item} className="col-md-4">
                          <div className="card border shadow-sm bg-white p-3 rounded-4 h-100 position-relative transition-all hover-scale hover-border-brand">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <span className="fw-bold text-dark fs-6 text-truncate pe-3">{item}</span>
                              <button type="button" className="btn btn-sm btn-light text-danger rounded-circle p-1 d-flex align-items-center justify-content-center position-absolute top-0 end-0 mt-2 me-2 border hover-bg-danger hover-text-white transition-all" style={{ width: '28px', height: '28px' }} onClick={() => {
                                const newExtras = { ...pricing.extraPrices };
                                delete newExtras[item];
                                setPricing({ ...pricing, extraPrices: newExtras });
                              }}>
                                <i className="bi bi-x-lg" style={{ fontSize: "0.8rem" }}></i>
                              </button>
                            </div>
                            <div className="input-group input-group-sm rounded-3 overflow-hidden bg-light mt-auto">
                              <span className="input-group-text bg-light border-0 text-muted px-3 fw-bold">₹</span>
                              <input
                                type="number"
                                className="form-control border-0 modern-input bg-light fw-bold text-dark fs-6 py-2 rounded-0 rounded-end"
                                value={price}
                                onChange={(e) => {
                                  const newExtras = { ...pricing.extraPrices };
                                  newExtras[item] = parseInt(e.target.value) || 0;
                                  setPricing({ ...pricing, extraPrices: newExtras });
                                }}
                                min="0"
                                style={{ boxShadow: "none" }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-top text-end mt-4">
                    <button type="submit" className="btn btn-gradient btn-lg px-5 py-2 rounded-pill shadow-sm fw-bold d-inline-flex align-items-center transition-all" disabled={isLoading}>
                      {isLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving Updates...</>
                      ) : (
                        <><i className="bi bi-shield-check me-2 fs-5"></i> Save Changes</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Info & Audit Log */}
          <div className="col-lg-4 d-flex flex-column gap-4 fade-in" style={{ animationDelay: '0.2s' }}>

            {/* HOW IT WORKS */}
            <div className="glass-panel position-relative overflow-hidden transition-all hover-shadow" style={{ background: "linear-gradient(135deg, rgba(255, 81, 47, 0.05) 0%, rgba(221, 36, 118, 0.05) 100%)", border: "1px solid rgba(255, 81, 47, 0.2)" }}>
              <div className="position-absolute top-0 end-0 opacity-10 p-3" style={{ transform: "translate(10%, -10%)" }}>
                <i className="bi bi-info-circle-fill" style={{ fontSize: "120px", color: "var(--brand-secondary)" }}></i>
              </div>
              <div className="card-body p-4 position-relative z-index-1">
                <div className="d-flex align-items-center mb-4">
                  <div className="brand-icon-bg rounded-circle shadow-sm d-flex justify-content-center align-items-center me-3" style={{ width: '45px', height: '45px' }}>
                    <i className="bi bi-lightbulb-fill fs-5"></i>
                  </div>
                  <h5 className="nav-title m-0 text-gradient">How It Works</h5>
                </div>

                <p className="text-muted mb-4 small fw-medium">The values configured here strictly dictate the automated billing ledger.</p>

                <ul className="list-unstyled text-secondary small d-flex flex-column gap-3 mb-0">
                  <li className="d-flex align-items-start bg-white p-3 rounded-4 shadow-sm border border-light">
                    <i className="bi bi-check-circle-fill text-success mt-1 me-3 fs-5"></i>
                    <span>Students are billed precisely on the <strong className="text-dark">Per-Meal Costs</strong> for consumed meals.</span>
                  </li>
                  <li className="d-flex align-items-start bg-white p-3 rounded-4 shadow-sm border border-light">
                    <i className="bi bi-pause-circle-fill text-warning mt-1 me-3 fs-5"></i>
                    <span>A <strong className="text-dark">{pricing.rules?.noticeHours || 24} hours</strong> notice is required to cancel a meal successfully.</span>
                  </li>
                  <li className="d-flex align-items-start bg-white p-3 rounded-4 shadow-sm border border-light">
                    <i className="bi bi-shield-lock-fill mt-1 me-3 fs-5" style={{ color: 'var(--brand-primary)' }}></i>
                    <span><strong className="text-dark">Immutable Ledger:</strong> Updates only affect future days. Past generated bills cannot be altered.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* AUDIT LOG CARD */}
            <div className="card shadow-sm border-0 rounded-4 flex-grow-1 d-flex flex-column hover-shadow transition-all bg-white">
              <div className="card-header bg-white border-bottom pt-4 pb-3 px-4 d-flex align-items-center justify-content-between">
                <h6 className="nav-title m-0 d-flex align-items-center">
                  <i className="bi bi-clock-history text-muted me-2 fs-5"></i> Recent Changes
                </h6>
                <span className="badge text-dark border rounded-pill px-3 py-2 fw-medium" style={{ backgroundColor: 'rgba(255, 81, 47, 0.1)', borderColor: 'rgba(255, 81, 47, 0.2)' }}>Last 5</span>
              </div>
              <div className="card-body p-0 bg-white rounded-bottom-4">
                <div className="list-group list-group-flush rounded-bottom-4">
                  {auditLog.length === 0 ? (
                    <div className="p-5 text-center text-muted small d-flex flex-column align-items-center">
                      <i className="bi bi-journal-x fs-1 text-light mb-2"></i>
                      No recent changes logged.
                    </div>
                  ) : auditLog.slice(0, 5).map((log, index) => (
                    <div key={log._id} className="list-group-item p-3 border-bottom-0 border-top hover-bg-light transition-all">
                      <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-dark text-truncate d-block" style={{ maxWidth: "75%", fontSize: "0.9rem" }}>{log.action}</span>
                        <span className="text-muted small fw-medium" style={{ fontSize: "0.75rem" }}><i className="bi bi-calendar-event me-1"></i>{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="text-muted d-flex align-items-center small" style={{ fontSize: "0.8rem" }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px', backgroundColor: 'rgba(221, 36, 118, 0.1)' }}>
                          <i className="bi bi-person-fill" style={{ fontSize: '12px', color: 'var(--brand-secondary)' }}></i>
                        </div>
                        <span className="fw-medium">{log.admin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default DynamicPricing;