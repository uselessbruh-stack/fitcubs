import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://backend-production-156a.up.railway.app';

// Helper function to format date from either string or Firestore Timestamp
const formatDate = (dateValue, includeTime = false) => {
  if (!dateValue) return 'N/A';

  let date;
  if (typeof dateValue === 'string') {
    // Handle ISO string format
    date = new Date(dateValue);
  } else if (dateValue.seconds) {
    // Handle Firestore Timestamp format
    date = new Date(dateValue.seconds * 1000);
  } else if (dateValue._seconds) {
    // Handle alternative Timestamp format
    date = new Date(dateValue._seconds * 1000);
  } else {
    return 'N/A';
  }

  return includeTime ? date.toLocaleString() : date.toLocaleDateString();
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [showCharts, setShowCharts] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const authStatus = localStorage.getItem('fitcubs_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchRegistrations();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'fitcubs@2000') {
      localStorage.setItem('fitcubs_admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
      fetchRegistrations();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fitcubs_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
    setRegistrations([]);
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/export-registrations`);
      const result = await response.json();

      if (result.success) {
        setRegistrations(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch registrations');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      alert('Error fetching data: ' + error.message);
    }
    setLoading(false);
  };

  const getCategoryStats = () => {
    const stats = {};
    registrations.forEach(reg => {
      const category = reg.category || 'Unknown';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  };

  const getGenderStats = () => {
    const stats = { Boy: 0, Girl: 0, Other: 0 };
    registrations.forEach(reg => {
      const gender = reg.gender || 'Other';
      stats[gender] = (stats[gender] || 0) + 1;
    });
    return stats;
  };

  const getBreakfastStats = () => {
    let withBreakfast = 0;
    let withoutBreakfast = 0;
    registrations.forEach(reg => {
      if (reg.breakfastCount && reg.breakfastCount > 0) {
        withBreakfast++;
      } else {
        withoutBreakfast++;
      }
    });
    return { withBreakfast, withoutBreakfast };
  };

  const getTshirtStats = () => {
    const stats = {};
    registrations.forEach(reg => {
      const size = reg.tshirtSize || 'Unknown';
      stats[size] = (stats[size] || 0) + 1;
    });
    return stats;
  };

  const downloadCSV = () => {
    if (registrations.length === 0) {
      alert('No data to download');
      return;
    }

    // Define CSV headers
    const headers = [
      'Registration ID',
      'Child Name',
      'Gender',
      'Age',
      'Date of Birth',
      'Parent Name',
      'Contact Number',
      'Email',
      'School Name',
      'School Area',
      'Category',
      'T-Shirt Size',
      'Breakfast Count',
      'Total Amount',
      'Payment ID',
      'Registration Date'
    ];

    // Create CSV rows
    const rows = registrations.map(reg => [
      reg.id,
      reg.childName || '',
      reg.gender || '',
      reg.age || '',
      reg.dateOfBirth || '',
      reg.parentName || '',
      reg.parentContact || '',
      reg.parentEmail || '',
      reg.schoolName || '',
      reg.schoolArea || 'N/A',
      reg.category || '',
      reg.tshirtSize || '',
      reg.breakfastCount || 0,
      reg.totalAmount || '',
      reg.transactionId || '',
      formatDate(reg.createdAt, true)
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `fitcubs_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        <div className="login-container">
          <div className="login-box">
            <h1>🏃‍♂️ Fit Cubs Admin Portal</h1>
            <p>Enter password to access</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>🏃‍♂️ Fit Cubs Admin Portal</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </header>

        <div className="dashboard-content">
          <div className="stats-card">
            <h2>Total Successful Registrations</h2>
            <p className="stats-number">{registrations.length}</p>
          </div>

          <div className="action-card">
            <h3>Download Registrations Data</h3>
            <p>Download all successful registrations as CSV file</p>

            <button
              onClick={fetchRegistrations}
              className="refresh-btn"
              disabled={loading}
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
            </button>

            <button
              onClick={downloadCSV}
              className="download-btn"
              disabled={registrations.length === 0}
            >
              📥 Download CSV
            </button>

            <button
              onClick={() => setShowCharts(true)}
              className="charts-btn"
              disabled={registrations.length === 0}
            >
              📊 View Charts
            </button>

            {registrations.length > 0 && (
              <p className="info-text">
                Last updated: {new Date().toLocaleString()}
              </p>
            )}
          </div>

          {showCharts && registrations.length > 0 && (
            <div className="charts-modal" onClick={() => setShowCharts(false)}>
              <div className="charts-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setShowCharts(false)}>✕</button>
                <h2>📊 Registration Statistics</h2>

                <div className="stats-grid">
                  <div className="stat-box">
                    <h4>Total Registrations</h4>
                    <p className="big-number">{registrations.length}</p>
                  </div>
                  <div className="stat-box">
                    <h4>Total Revenue</h4>
                    <p className="big-number">₹{registrations.reduce((sum, r) => sum + (r.totalAmount || 0), 0).toFixed(2)}</p>
                  </div>
                  <div className="stat-box">
                    <h4>With Breakfast</h4>
                    <p className="big-number">{getBreakfastStats().withBreakfast}</p>
                  </div>
                  <div className="stat-box">
                    <h4>Breakfast Revenue</h4>
                    <p className="big-number">₹{(registrations.reduce((sum, r) => sum + ((r.breakfastCount || 0) * 100), 0)).toFixed(2)}</p>
                  </div>
                </div>

                <div className="chart-section">
                  <h3>Registrations by Category</h3>
                  <div className="bar-chart">
                    {Object.entries(getCategoryStats()).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                      <div key={category} className="bar-item">
                        <div className="bar-label" title={category}>{category.split(' - ')[0]} Years</div>
                        <div className="bar-wrapper">
                          <div
                            className="bar-fill"
                            style={{ width: `${(count / registrations.length) * 100}%` }}
                          >
                            <span className="bar-value">{count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="charts-row">
                  <div className="chart-section">
                    <h3>Gender Distribution</h3>
                    <div className="pie-chart-simple">
                      {Object.entries(getGenderStats()).map(([gender, count]) => count > 0 && (
                        <div key={gender} className="pie-item">
                          <div className="pie-color" style={{ background: gender === 'Boy' ? '#35AEBF' : gender === 'Girl' ? '#F47475' : '#9CBC1D' }}></div>
                          <span>{gender}: {count} ({((count / registrations.length) * 100).toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="chart-section">
                    <h3>T-Shirt Size Distribution</h3>
                    <div className="bar-chart-mini">
                      {Object.entries(getTshirtStats()).sort((a, b) => b[1] - a[1]).map(([size, count]) => (
                        <div key={size} className="bar-item-mini">
                          <span className="bar-label-mini">{size}</span>
                          <div className="bar-wrapper-mini">
                            <div className="bar-fill-mini" style={{ width: `${(count / registrations.length) * 100}%` }}>
                              <span className="bar-value-mini">{count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {registrations.length > 0 && (
            <div className="preview-card">
              <h3>Recent Registrations</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Child Name</th>
                      <th>Age</th>
                      <th>Parent Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>School</th>
                      <th>Category</th>
                      <th>T-Shirt</th>
                      <th>Breakfast</th>
                      <th>Amount</th>
                      <th>Payment ID</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.slice(0, 10).map((reg) => (
                      <tr key={reg.id}>
                        <td>{reg.childName}</td>
                        <td>{reg.age}</td>
                        <td>{reg.parentName}</td>
                        <td>{reg.parentContact}</td>
                        <td>{reg.parentEmail}</td>
                        <td>{reg.schoolName}</td>
                        <td>{reg.category}</td>
                        <td>{reg.tshirtSize}</td>
                        <td>{reg.breakfastCount || 0}</td>
                        <td>₹{reg.totalAmount}</td>
                        <td style={{ fontSize: '0.85em', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={reg.transactionId}>{reg.transactionId ? reg.transactionId.substring(0, 12) + '...' : 'N/A'}</td>
                        <td>{formatDate(reg.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {registrations.length > 10 && (
                <p className="info-text">
                  Showing 10 of {registrations.length} registrations
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
