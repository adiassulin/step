// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;
import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*; 

/** Servlet that returns recommendations data*/
@WebServlet("/data")
public class DataServlet extends HttpServlet {
 
  /**
  * returns as response all the recommendations ap to given limit.
  */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
      int limit = Integer.parseInt(request.getParameter("limit"));
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      Query query = new Query("Task");
      PreparedQuery results = datastore.prepare(query);

      ArrayList<String> comments = new ArrayList<>();
      for (Entity comment : results.asList(FetchOptions.Builder.withLimit(limit))) {
          comments.add((String) comment.getProperty("comment"));
      }

      response.setContentType("application/json");
      String json = new Gson().toJson(comments);
      response.getWriter().println(json);
  }


  /**
  * gets as a paremeter a recommendation and adds it to the database.
  */
   @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
 {
    String comment = request.getParameter("text-input");
  
    Entity commentEntity = new Entity("Task");
    commentEntity.setProperty("comment", comment);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    // Redirect back to the HTML page.
    response.sendRedirect("/index.html");
  }

}
