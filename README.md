![](https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/1962fb41-8ae1-43a1-b303-c667e407a345)

### Say Goodbye to your sly bug

# What's FalcoEye

FalconEye is a developer-first error tracking platform that help developers to continuously manage and analyze errors logs about applications.

# Outline

- [Waht's FalconEye]()
- [Features]()
- [Getting Started]()
- [Architechture]()
- [Table Schema]()

# Features

### **Capture error logs with custom-developed SDK**

- Encapsulate user validation and error data upload APIs into user-friendly SDK functions.
- users have the flexibility to capture specific error logs for the function selectively, or capture them in the entire Express application using middleware.

### **Automate source map file uploads via custom-developed CLI tool**

- A simple interactive command-line user interface is provided, where setting up the configuration requires answering only a few questions.
- Source map files, are automatically built from the source code and uploaded by GitHub Actions.

### **Personalized analytics dashboard**

-Time-series-based plots for errors and alerts help users manage projects more effectively.

### **Source code location mapping**

### **Customized alert system**

# Getting Started

1. Sign up an account in FalconEye, or or you can use the test account below:

   | Testing Account |                   |
   | :-------------- | :---------------- |
   | Email           | a186235@gmail.com |
   | Password        | 1234              |

   you can look some example issues and dashboard in the account. If you want to capture errors by yourself, following steps below.

2. Create a project on projects page, and:

   - Get user key & client token

      <table>
      <tr>
         <td valign="top"><img align="top" src="https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/c781c372-b84a-49e5-9d50-72b95e5e9d95" style="vertical-align: top;" /></td>
         <td valign="top"><img align="top" src="https://github.com/Chen-Yuan-Lai/FalconEye/assets/108986288/ec87fc23-a7ed-47f5-bc57-5dac861528c7" /></td>
      </tr>
      </table>

3. Set up [FalconEye SDK](https://www.npmjs.com/package/@falconeye-tech/sdk) in your application runtime

   - **Install**
     ```
     npm i @falconeye-tech/sdk
     ```
   - **Configure**

     ```
     import fe from '@falconeye-tech/sdk';

      const er = new fe();

      await er.init({
         apiHost: 'https://handsomelai.shop',
         userKey: '',
         clientToken: '',
      });

     ```

   - **Usage**

     ```
     app.use(er.requestHandler());

      app.get('/typeError', async (req, res, next) => {
         try {
            console.logg('Hi');
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

# Architechture

# Table Schema
