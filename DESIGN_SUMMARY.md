# 📄 Design Summary – Content Review & Feedback Platform

## 1. Architecture Decisions

The application follows a modular full-stack architecture designed for maintainability, scalability, and separation of responsibilities.

---

## 1.1 Layered Architecture (Separation of Concerns)

The system uses a layered architecture with clear responsibilities between frontend, backend, and database layers.

| Layer |              Responsibility |                        Implementation |

| Presentation Layer   User interface and client-side logic        React, Vite, Tailwind CSS 

| API Layer            REST API endpoints and request handling     Express.js 

| Business Layer       Application logic and processing            Services, Controllers 

| Data Layer           Data persistence                            MongoDB + Mongoose 

### Why this approach?

This structure improves:

- Code organization
- Maintainability
- Testinga
- Future feature expansion

Each layer has a single responsibility, making it easier to modify one part of the system without affecting others.





### 1.2 Feedback Service Abstraction

Feedback generation is decoupled from core application logic using the Strategy Pattern.

A factory dynamically selects the feedback provider based on the `FEEDBACK_PROVIDER` environment variable.

The system supports two providers:
- **Rule-Based Service** – uses heuristics (sentence length, passive voice, word complexity)
- **Groq AI Service** – uses a large language model for context‑aware analysis

The AI service automatically falls back to rule‑based logic if the API fails.

This abstraction enables easy provider switching, cleaner controllers, and simplified testing.

New AI providers (OpenAI, Claude, etc.) can be added with minimal changes to existing code.



### Benefits:

- Easy provider switching
- Cleaner controller logic
- Easier testing
- Future support for additional AI providers

---

# 1.3 Database Design Decision

MongoDB is used with Mongoose ODM.

Submission documents contain their related feedback information:

{
 title: String,
 content: String,
 category: String,

 feedback: {
   readabilityScore: Number,
   clarityScore: Number,
   suggestions: Array
 }
}

   # Why embedded feedback?

Feedback belongs directly to a submission and does not exist independently.

Advantages:

Faster retrieval
Fewer database queries
Simple data structure
Trade-off

If the system later requires advanced analytics across feedback records, a separate feedback collection could be introduced.

# 1.4 Authentication Design

The application uses JWT-based authentication.

Users authenticate through:

Register endpoint
Login endpoint

After successful login, a JWT token is generated and used for protected requests.

# Why JWT?

Advantages:

Stateless authentication
Easy API scaling
Suitable for web and mobile clients

Security measures:

Password hashing with bcrypt
Protected API routes
Token expiration
Request rate limiting
Security headers using Helmet

2. Role-Based Access Control Implementation

The system uses authorization rules to protect user data.

User Permissions

Authenticated users can:

Create submissions
View their submissions
Update their submissions
Delete their submissions
Generate feedback
Access Control Process

# Every protected request follows this flow:

Client Request

      |

JWT Verification Middleware

      |

User Identity Extraction

      |

Permission Check

      |

Controller Execution

The backend ensures users can only access their own data.

Example:

Submission.findOne({
   _id: submissionId,
   user: userId
})

This prevents users from viewing or modifying another user's content.

3. File Upload Handling

The application supports file upload flow for content attachments.

The upload process follows:

React Frontend

      |

User selects file

      |

FormData request

      |

Express Backend

      |

File validation middleware

      |

Store file information

      |

MongoDB record update
Backend Handling

The backend validates:

File type
File size
Upload permissions

Uploaded files are processed through middleware before being stored.

Frontend Handling

The frontend:

Provides file selection UI
Creates multipart/form-data requests
Sends files securely to the backend

This design keeps file handling separate from business logic.

4. Trade-offs Made


Decision	                        Reason	                          Trade-off
MongoDB instead of SQL	      Flexible document structure and easy integration with Node.js	Less relational enforcement
JWT authentication	      Simple and scalable                     	Requires secure token management
Embedded feedback data        Faster access with fewer queries	      Complex analytics may require restructuring
Rule-based + AI feedback      Supports free and advanced feedback options  	AI requires external API availability
React + Vite	            Faster development experience	                  Requires manual configuration
Modular backend services	Easier maintenance	                          More files and structure
File validation middleware	Improves security	                           Adds processing overhead


5. Security Considerations

The application includes:

Password hashing
JWT verification
Protected routes
Input validation
CORS configuration
Rate limiting
Secure HTTP headers

These protections reduce common security risks such as:

Unauthorized access
Brute-force attacks
Invalid input processing

6. Scalability Considerations

The system is designed for future improvements:

Possible extensions:

Additional AI providers
Advanced analytics dashboard
More user roles
Cloud file storage
Notification system

The current architecture allows these features without major restructuring.

7. Final Summary

The design focuses on:

Clean architecture
Security
Maintainability
Extensibility

The separation between frontend, backend services, and database allows the application to grow while keeping the codebase organized.



Author: Zelalem Ybabe

Date: June 2026
 

