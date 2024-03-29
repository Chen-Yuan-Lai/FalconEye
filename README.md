<div style="text-align: center;">
    <img width="100%" src=https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/1962fb41-8ae1-43a1-b303-c667e407a345>
</div>

### Say Goodbye to your sly bug.

# What's FalcoEye

FalconEye is a developer-first error tracking platform that help developers to continuously manage and analyze errors logs about applications.

# Outline

- [Waht's FalconEye](https://github.com/Chen-Yuan-Lai/FalconEye?tab=readme-ov-file#whats-falcoeye)
- [Features](https://github.com/Chen-Yuan-Lai/FalconEye?tab=readme-ov-file#features)
- [Getting Started](https://github.com/Chen-Yuan-Lai/FalconEye?tab=readme-ov-file#getting-started)
- [Architechture](https://github.com/Chen-Yuan-Lai/FalconEye?tab=readme-ov-file#architecture)
- [Monitoring](https://github.com/Chen-Yuan-Lai/FalconEye?tab=readme-ov-file#monitoring)
- [Schema](https://github.com/Chen-Yuan-Lai/FalconEye?tab=readme-ov-file#schema)
- [License](https://github.com/Chen-Yuan-Lai/FalconEye?tab=readme-ov-file#license)

# Features

### **Capture error logs with custom-developed SDK**

- Encapsulate user validation and error data upload APIs into user-friendly SDK functions.
- users have the flexibility to capture specific error logs for the function selectively, or capture them in the entire Express application using middleware.

### **Automate source map file uploads via custom-developed CLI tool**

- A simple interactive command-line user interface is provided, where setting up the configuration requires answering only a few questions.
- Source map files, are automatically built from the source code and uploaded by GitHub Actions.
  ![wizard](https://github.com/Chen-Yuan-Lai/targetProject/assets/108986288/e6577bd9-bd03-4ff2-ae08-c91e9994b2c5)
  ![GitHub Actions](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/a1c266bd-ec70-4087-b08d-6981516446e2)

### **Personalized analytics dashboard**

- Simplify and organize error logs by classifying them into distinct issues to reduce duplicate information.
- Time-series-based plots for errors and alerts help users manage projects more effectively.
  ![dashboard](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/a85b05a1-7cb6-4748-9e7c-eaa81c3f5a1d)

### **Source code location mapping**

- Provided a precise code block for each error, enabling users to easily locate and address bugs.
  ![codeBlock](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/eac71f1a-138e-4f6a-a2db-8cf42863b2ed)

### **Customized alert system**

- Provided various rules, threshold, and checking interval, users can create application-specific alerting tailored to their specific needs.
  ![alert](https://github.com/Chen-Yuan-Lai/targetProject/assets/108986288/6561824e-d154-4e2c-beee-304d6cd7ab25)

# Getting Started

1. Sign up an account in FalconEye, or or you can use the test account below:

   | Testing Account |                   |
   | :-------------- | :---------------- |
   | Email           | a186235@gmail.com |
   | Password        | 1234              |

   - you can look some example issues and dashboard in the account.
   - Trying to install the [example project](https://github.com/Chen-Yuan-Lai/targetProject) and experience how FalconEye capturing errors.
   - If you want to capture errors by yourself, following steps below.

2. Create a project on projects page, and:

   - Get user key & client token

      <table>
      <tr>
         <td align="top"><img align="top" src="https://github.com/Chen-Yuan-Lai/targetProject/assets/108986288/9b0c4638-88ea-4516-83f9-b2559ae10be8" style="vertical-align: top;" />Get user key</td>
         <td align="top"><img align="top" src="https://github.com/Chen-Yuan-Lai/targetProject/assets/108986288/ecb0d26b-f9a7-4d3f-af22-b915156693f0" />Get client token</td>
      </tr>
      </table>

3. Set up [FalconEye SDK](https://www.npmjs.com/package/@falconeye-tech/sdk) in your application runtime

   - **Install**
     ```
     npm i @falconeye-tech/sdk
     ```
   - **Configure**

     ```javascript
     import fe from "@falconeye-tech/sdk";

     const er = new fe();

     await er.init({
       apiHost: "https://handsomelai.shop",
       userKey: "",
       clientToken: "",
     });
     ```

   - **Usage**

     ```javascript
     app.use(er.requestHandler());

     app.get("/typeError", async (req, res, next) => {
       try {
         console.logg("Hi");
       } catch (e) {
         next(e);
       }
     });

     // ... routes

     app.use(er.errorHandler());

     // Global error handler
     app.use((err, req, res, next) => {
       res.status(error.statusCode).json({
         error: error.message,
       });
     });
     ```

4. Built and upload source map file by [FalconEye wizard](https://www.npmjs.com/package/@falconeye-tech/wizard)(optional)

   If you want to know actual location in the source codes about the errors, you need to do steps below:

   - Run wizard

   ```
   npx @falconeye-tech/wizard wizard
   ```

# Architecture

![System design](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/2a7ad1fd-b170-4dad-bfb8-2d5831316144)

To enhance system scalability and fault tolerance, FalconEye implemented a strategy of decomposing its monolithic server into multiple services, with each one focusing on a specific, simple functionality.

1. Gateway server: Its role is not only to receive and authenticate client requests, but also as a producer, enqueuing the corresponding tasks into Apache Kafka.
2. [Kafka Service](https://github.com/Chen-Yuan-Lai/kafka): Serves as a mediator between the Gateway Server and other services, storing error log data and tasks for scheduled checks of alert rules.

3. [Event service](https://github.com/Chen-Yuan-Lai/falconeye-event-service): a consumer to pull and process event data from Kafka
4. [Notification service](https://github.com/Chen-Yuan-Lai/falconeye-notification-service): a consumer to pull and check alert rule from Kafka

### Features

- Enhanced the scalability by decomposing notification and event process features into distinct **Fastify services**, optimizing resource allocation.
- Improved system scalability by setting up **AWS EventBridge** and **Lambda** for automated task handling and alert checks in the notification service.
- Optimized system efficiency and job handling capacity by integrating **Apache Kafka** for asynchronously processing high-throughput event and notification tasks.
- All services in the project are containerized using **Docker**, increasing system portability.

# Load test

To test the system's stability under long-term data uploading and writing scenarios, I used K6 to conduct the following test plan.

### Test program

**Warming up phase**: increase to 100 virtual users in 1 minute.

**Phase 1**: maintain 100 virtual users in 3 minutes.

**Increase load**: increase to N virtual users in 1 minute.

**Phase 2**: maintain N virtual users in 3 minutes.

**Cooling down phase**: increase to N virtual users in 1 minute.

### Result

| VUs(p1/p2) | machine type (gateway/ kafka) | failed | RPS   | gateway server CPU usage (min/max) | consumer+kafka CPU usage (min/max) |
| :--------- | :---------------------------- | :----- | :---- | :--------------------------------- | :--------------------------------- |
| 100/400    | t2.micro/t2.small             | 0.00%  | 151   | 70/100                             | 40/92                              |
| 100/400    | 2 \* t2.micro/t2.small        | 0.00%  | 160   | 50/100                             | 45/100                             |
| 100/600    | t2.micro/t2.small             | 2.42%  | 131   | 70/100                             | 40/100                             |
| 100/600    | t3.micro/t2.small             | 0.16%  | 198.5 | 70/100                             | 40/100                             |
| 100/600    | t3.micro/t2.small             | NA     | NA    | 50/-                               | 40/-                               |

# Monitoring

![monitor](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/7b882914-37d2-41ae-b7b8-2e99cb0d66ee)

- Attained high availability by Monitoring system (CPU, RAM, and disk usage) and specific
  (Kafka) metrics for each EC2 instance via Prometheus and Grafana servers.

<!-- ![source map upload](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/acaa6833-2ce0-4755-b2db-b9573142bef3)


![query](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/453ecf38-f696-4339-b00e-cdb8b944c0db) -->

# schema

![table schema](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/d67cbae4-ee8a-4bed-a5de-04670e395494)

# License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Chen-Yuan-Lai/FalconEye/blob/develop/LICENSE) file for details.
