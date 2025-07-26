import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [isLabReport, setIsLabReport] = useState(true);
  const [formData, setFormData] = useState({
    logo: null,
    universityName: '',
    courseTitle: '',
    courseCode: '',
    labReportNo: '',
    assignmentTitle: '',
    submittedTo: '',
    teacherDesignation: '',
    department: '',
    universityAddress: '',
    studentName: '',
    studentID: '',
    batch: '',
    submissionDate: '',
    teamMembers: [{ name: '', id: '' }]
  });

  const contentRef = useRef();

  const handleInputChange = (e, index = null) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setFormData({ ...formData, logo: URL.createObjectURL(files[0]) });
    } else if (name === 'teamName' || name === 'teamId') {
      const updatedTeam = [...formData.teamMembers];
      updatedTeam[index][name === 'teamName' ? 'name' : 'id'] = value;
      setFormData({ ...formData, teamMembers: updatedTeam });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: '', id: '' }]
    });
  };

  const downloadPDF = () => {
    const input = contentRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('FrontPage.pdf');
    });
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>📝 Front Page Generator</h1>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              checked={isLabReport}
              onChange={() => setIsLabReport(!isLabReport)}
            />
            {isLabReport ? 'Lab Report Mode' : 'Assignment Mode'}
          </label>
        </div>
      </div>

      <div className="form-area">
        <input type="file" name="logo" accept="image/*" onChange={handleInputChange} />
        <input type="text" name="universityName" placeholder="University Name" onChange={handleInputChange} />
        <input type="text" name="courseTitle" placeholder="Course Title" onChange={handleInputChange} />
        <input type="text" name="courseCode" placeholder="Course Code" onChange={handleInputChange} />

        {isLabReport ? (
          <>
            <input type="text" name="labReportNo" placeholder="Lab Report No." onChange={handleInputChange} />
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <input
                  type="text"
                  name="teamName"
                  placeholder="Team Member Name"
                  value={member.name}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <input
                  type="text"
                  name="teamId"
                  placeholder="Team Member ID"
                  value={member.id}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </div>
            ))}
            <button onClick={addTeamMember}>➕ Add Member</button>
          </>
        ) : (
          <input type="text" name="assignmentTitle" placeholder="Assignment Title" onChange={handleInputChange} />
        )}

        <input type="text" name="submittedTo" placeholder="Submitted To" onChange={handleInputChange} />
        <input type="text" name="teacherDesignation" placeholder="Teacher's Designation" onChange={handleInputChange} />
        <input type="text" name="department" placeholder="Department" onChange={handleInputChange} />
        <input type="text" name="universityAddress" placeholder="University Address" onChange={handleInputChange} />
        <input type="text" name="studentName" placeholder="Student Name" onChange={handleInputChange} />
        <input type="text" name="studentID" placeholder="Student ID" onChange={handleInputChange} />
        <input type="text" name="batch" placeholder="Batch" onChange={handleInputChange} />
        <input type="date" name="submissionDate" onChange={handleInputChange} />

        <button className="download-btn" onClick={downloadPDF}>📥 Download as PDF</button>
      </div>

      <div className="preview" ref={contentRef}>
        {formData.logo && <img src={formData.logo} alt="Logo" className="logo-preview" />}
        <h2>{formData.universityName}</h2>
        <h3>{formData.courseTitle} ({formData.courseCode})</h3>
        {isLabReport ? (
          <h4>Lab Report: {formData.labReportNo}</h4>
        ) : (
          <h4>{formData.assignmentTitle}</h4>
        )}
        <p>Submitted to:<br />
          {formData.submittedTo}<br />
          {formData.teacherDesignation}<br />
          {formData.department}<br />
          {formData.universityAddress}
        </p>
        <p>Submitted by:<br />
          {formData.studentName}<br />
          ID: {formData.studentID}<br />
          Batch: {formData.batch}
        </p>
        {isLabReport && formData.teamMembers.length > 0 && (
          <>
            <h4>Team Members:</h4>
            <ul>
              {formData.teamMembers.map((member, idx) => (
                <li key={idx}>{member.name} (ID: {member.id})</li>
              ))}
            </ul>
          </>
        )}
        <p>Date of Submission: {formData.submissionDate}</p>
      </div>
    </div>
  );
}

export default App;
