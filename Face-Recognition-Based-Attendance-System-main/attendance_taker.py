# import json
# import dlib
# import numpy as np
# import cv2
# import os
# import pandas as pd
# import time
# import logging
# import sqlite3
# import datetime
# import requests

# # Dlib / Use frontal face detector of Dlib
# detector = dlib.get_frontal_face_detector()

# # Dlib landmark / Get face landmarks
# predictor = dlib.shape_predictor('data/data/data_dlib/shape_predictor_68_face_landmarks .dat')

# # Dlib Resnet Use Dlib resnet50 model to get 128D face descriptor
# face_reco_model = dlib.face_recognition_model_v1("data/data/data_dlib/dlib_face_recognition_resnet_model_v1 .dat")

# # Create a connection to the database
# conn = sqlite3.connect("attendance.db")
# cursor = conn.cursor()

# # Drop the attendance table if it exists and recreate it
# cursor.execute("DROP TABLE IF EXISTS attendance")
# create_table_sql = """
# CREATE TABLE attendance (
#     roll_number TEXT,
#     time TEXT,
#     date DATE,
#     UNIQUE(roll_number, date)
# )
# """
# cursor.execute(create_table_sql)

# # Commit changes and close the connection
# conn.commit()
# conn.close()

# class Face_Recognizer:
#     def __init__(self):
#         self.font = cv2.FONT_ITALIC

#         # FPS
#         self.frame_time = 0
#         self.frame_start_time = 0
#         self.fps = 0
#         self.fps_show = 0
#         self.start_time = time.time()

#         # cnt for frame
#         self.frame_cnt = 0

#         # Save the features of faces in the database
#         self.face_features_known_list = []
#         # Save the roll numbers of faces in the database
#         self.face_roll_number_known_list = []

#         # List to save centroid positions of ROI in frame N-1 and N
#         self.last_frame_face_centroid_list = []
#         self.current_frame_face_centroid_list = []

#         # List to save roll numbers of objects in frame N-1 and N
#         self.last_frame_face_roll_number_list = []
#         self.current_frame_face_roll_number_list = []

#         # cnt for faces in frame N-1 and N
#         self.last_frame_face_cnt = 0
#         self.current_frame_face_cnt = 0

#         # Save the e-distance for faceX when recognizing
#         self.current_frame_face_X_e_distance_list = []

#         # Save the positions and roll numbers of current faces captured
#         self.current_frame_face_position_list = []
#         # Save the features of people in the current frame
#         self.current_frame_face_feature_list = []

#         # e distance between centroid of ROI in last and current frame
#         self.last_current_frame_centroid_e_distance = 0

#         # Reclassify after 'reclassify_interval' frames
#         self.reclassify_interval_cnt = 0
#         self.reclassify_interval = 10

#     # "features_all.csv" / Get known faces from "features_all.csv"
#     def get_face_database(self):
#         if os.path.exists("data/features_all.csv"):
#             path_features_known_csv = "data/features_all.csv"
#             csv_rd = pd.read_csv(path_features_known_csv, header=None)
#             for i in range(csv_rd.shape[0]):
#                 features_someone_arr = []
#                 self.face_roll_number_known_list.append(csv_rd.iloc[i][0])
#                 for j in range(1, 129):
#                     if csv_rd.iloc[i][j] == '':
#                         features_someone_arr.append('0')
#                     else:
#                         features_someone_arr.append(csv_rd.iloc[i][j])
#                 self.face_features_known_list.append(features_someone_arr)
#             logging.info("Faces in Database： %d", len(self.face_features_known_list))
#             return 1
#         else:
#             logging.warning("'features_all.csv' not found!")
#             logging.warning("Please run 'get_faces_from_camera.py' "
#                             "and 'features_extraction_to_csv.py' before 'face_reco_from_camera.py'")
#             return 0

#     def update_fps(self):
#         now = time.time()
#         # Refresh fps per second
#         if str(self.start_time).split(".")[0] != str(now).split(".")[0]:
#             self.fps_show = self.fps
#         self.start_time = now
#         self.frame_time = now - self.frame_start_time
#         self.fps = 1.0 / self.frame_time
#         self.frame_start_time = now

#     @staticmethod
#     # Compute the e-distance between two 128D features
#     def return_euclidean_distance(feature_1, feature_2):
#         feature_1 = np.array(feature_1)
#         feature_2 = np.array(feature_2)
#         dist = np.sqrt(np.sum(np.square(feature_1 - feature_2)))
#         return dist

#     # Use centroid tracker to link face_x in current frame with person_x in last frame
#     def centroid_tracker(self):
#         for i in range(len(self.current_frame_face_centroid_list)):
#             e_distance_current_frame_person_x_list = []
#             # For object 1 in current_frame, compute e-distance with object 1/2/3/4/... in last frame
#             for j in range(len(self.last_frame_face_centroid_list)):
#                 self.last_current_frame_centroid_e_distance = self.return_euclidean_distance(
#                     self.current_frame_face_centroid_list[i], self.last_frame_face_centroid_list[j])

#                 e_distance_current_frame_person_x_list.append(
#                     self.last_current_frame_centroid_e_distance)

#             last_frame_num = e_distance_current_frame_person_x_list.index(
#                 min(e_distance_current_frame_person_x_list))
#             self.current_frame_face_roll_number_list[i] = self.last_frame_face_roll_number_list[last_frame_num]

#     # cv2 window / putText on cv2 window
#     def draw_note(self, img_rd):
#         # Add some info on windows
#         cv2.putText(img_rd, "Face Recognizer with Deep Learning", (20, 40), self.font, 1, (255, 255, 255), 1, cv2.LINE_AA)
#         cv2.putText(img_rd, "Frame:  " + str(self.frame_cnt), (20, 100), self.font, 0.8, (0, 255, 0), 1,
#                     cv2.LINE_AA)
#         cv2.putText(img_rd, "FPS:    " + str(self.fps.__round__(2)), (20, 130), self.font, 0.8, (0, 255, 0), 1,
#                     cv2.LINE_AA)
#         cv2.putText(img_rd, "Faces:  " + str(self.current_frame_face_cnt), (20, 160), self.font, 0.8, (0, 255, 0), 1,
#                     cv2.LINE_AA)
#         cv2.putText(img_rd, "Q: Quit", (20, 450), self.font, 0.8, (255, 255, 255), 1, cv2.LINE_AA)

#         for i in range(len(self.current_frame_face_roll_number_list)):
#             img_rd = cv2.putText(img_rd, "Face_" + str(i + 1), tuple(
#                 [int(self.current_frame_face_centroid_list[i][0]), int(self.current_frame_face_centroid_list[i][1])]),
#                                  self.font,
#                                  0.8, (255, 190, 0),
#                                  1,
#                                  cv2.LINE_AA)

#     def attendance(self, roll_number):
#         current_date = datetime.datetime.now().strftime('%Y-%m-%d')
#         conn = sqlite3.connect("attendance.db")
#         cursor = conn.cursor()
#         # Check if the roll number already has an entry for the current date
#         cursor.execute("SELECT * FROM attendance WHERE roll_number = ? AND date = ?", (roll_number, current_date))
#         existing_entry = cursor.fetchone()

#         if existing_entry:
#             print(f"{roll_number} is already marked as present for {current_date}")
#         else:
#             current_time = datetime.datetime.now().strftime('%H:%M:%S')
#             cursor.execute("INSERT INTO attendance (roll_number, time, date) VALUES (?, ?, ?)", (roll_number, current_time, current_date))
#             conn.commit()
#             print(f"{roll_number} marked as present for {current_date} at {current_time}")

#         conn.close()

#     # Face detection and recognition with OT from input video stream
#     def process(self, stream):
#         # 1.  Get faces known from "features.all.csv"
#         if self.get_face_database():
#             while stream.isOpened():
#                 self.frame_cnt += 1
#                 logging.debug("Frame " + str(self.frame_cnt) + " starts")
#                 flag, img_rd = stream.read()
#                 kk = cv2.waitKey(1)

#                 # 2.  Detect faces for frame X
#                 faces = detector(img_rd, 0)

#                 # 3.  Update cnt for faces in frames
#                 self.last_frame_face_cnt = self.current_frame_face_cnt
#                 self.current_frame_face_cnt = len(faces)

#                 # 4.  Update the face roll number list in last frame
#                 self.last_frame_face_roll_number_list = self.current_frame_face_roll_number_list[:]

#                 # 5.  update frame centroid list
#                 self.last_frame_face_centroid_list = self.current_frame_face_centroid_list
#                 self.current_frame_face_centroid_list = []

#                 # 6.1  if cnt not changes
#                 if (self.current_frame_face_cnt == self.last_frame_face_cnt) and (
#                         self.reclassify_interval_cnt != self.reclassify_interval):
#                     logging.debug("scene 1:   No face cnt changes in this frame!!!")

#                     self.current_frame_face_position_list = []

#                     if "unknown" in self.current_frame_face_roll_number_list:
#                         self.reclassify_interval_cnt += 1

#                     if self.current_frame_face_cnt != 0:
#                         for k, d in enumerate(faces):
#                             self.current_frame_face_position_list.append(tuple(
#                                 [faces[k].left(), int(faces[k].bottom() + (faces[k].bottom() - faces[k].top()) / 4)]))
#                             self.current_frame_face_centroid_list.append(
#                                 [int(faces[k].left() + faces[k].right()) / 2,
#                                  int(faces[k].top() + faces[k].bottom()) / 2])

#                             img_rd = cv2.rectangle(img_rd,
#                                                    tuple([d.left(), d.top()]),
#                                                    tuple([d.right(), d.bottom()]),
#                                                    (255, 255, 255), 2)

#                     # Multi-faces in current frame, use centroid-tracker to track
#                     if self.current_frame_face_cnt != 1:
#                         self.centroid_tracker()

#                     for i in range(self.current_frame_face_cnt):
#                         # 6.2 Write roll numbers under ROI
#                         img_rd = cv2.putText(img_rd, self.current_frame_face_roll_number_list[i],
#                                              self.current_frame_face_position_list[i], self.font, 0.8, (0, 255, 255), 1,
#                                              cv2.LINE_AA)
#                     self.draw_note(img_rd)

#                 # 6.2  If cnt of faces changes, 0->1 or 1->0 or ...
#                 else:
#                     logging.debug("scene 2: / Faces cnt changes in this frame")
#                     self.current_frame_face_position_list = []
#                     self.current_frame_face_X_e_distance_list = []
#                     self.current_frame_face_feature_list = []
#                     self.reclassify_interval_cnt = 0

#                     # 6.2.1  Face cnt decreases: 1->0, 2->1, ...
#                     if self.current_frame_face_cnt == 0:
#                         logging.debug("  / No faces in this frame!!!")
#                         # clear list of roll numbers and features
#                         self.current_frame_face_roll_number_list = []
#                     # 6.2.2 / Face cnt increase: 0->1, 0->2, ..., 1->2, ...
#                     else:
#                         logging.debug("  scene 2.2  Get faces in this frame and do face recognition")
#                         self.current_frame_face_roll_number_list = []
#                         for i in range(len(faces)):
#                             shape = predictor(img_rd, faces[i])
#                             self.current_frame_face_feature_list.append(
#                                 face_reco_model.compute_face_descriptor(img_rd, shape))
#                             self.current_frame_face_roll_number_list.append("unknown")

#                         # 6.2.2.1 Traversal all the faces in the database
#                         for k in range(len(faces)):
#                             logging.debug("  For face %d in current frame:", k + 1)
#                             self.current_frame_face_centroid_list.append(
#                                 [int(faces[k].left() + faces[k].right()) / 2,
#                                  int(faces[k].top() + faces[k].bottom()) / 2])

#                             self.current_frame_face_X_e_distance_list = []

#                             # 6.2.2.2  Positions of faces captured
#                             self.current_frame_face_position_list.append(tuple(
#                                 [faces[k].left(), int(faces[k].bottom() + (faces[k].bottom() - faces[k].top()) / 4)]))

#                             # 6.2.2.3 
#                             # For every faces detected, compare the faces in the database
#                             for i in range(len(self.face_features_known_list)):
#                                 # 
#                                 if str(self.face_features_known_list[i][0]) != '0.0':
#                                     e_distance_tmp = self.return_euclidean_distance(
#                                         self.current_frame_face_feature_list[k],
#                                         self.face_features_known_list[i])
#                                     logging.debug("      with person %d, the e-distance: %f", i + 1, e_distance_tmp)
#                                     self.current_frame_face_X_e_distance_list.append(e_distance_tmp)
#                                 else:
#                                     # person_X
#                                     self.current_frame_face_X_e_distance_list.append(999999999)

#                             # 6.2.2.4 / Find the one with minimum e distance
#                             similar_person_num = self.current_frame_face_X_e_distance_list.index(
#                                 min(self.current_frame_face_X_e_distance_list))

#                             if min(self.current_frame_face_X_e_distance_list) < 0.4:
#                                 self.current_frame_face_roll_number_list[k] = self.face_roll_number_known_list[similar_person_num]
#                                 logging.debug("  Face recognition result: %s",
#                                               self.face_roll_number_known_list[similar_person_num])
                                
#                                 # Insert attendance record
#                                 roll_number = self.face_roll_number_known_list[similar_person_num]

#                                 print(type(self.face_roll_number_known_list[similar_person_num]))
#                                 print(roll_number)
#                                 self.attendance(roll_number)
#                             else:
#                                 logging.debug("  Face recognition result: Unknown person")

#                         # 7.  / Add note on cv2 window
#                         self.draw_note(img_rd)

#                 # 8.  'q'  / Press 'q' to exit
#                 if kk == ord('q'):
#                     break

#                 self.update_fps()
#                 cv2.namedWindow("camera", 1)
#                 cv2.imshow("camera", img_rd)

#                 logging.debug("Frame ends\n\n")
        
#         # Save attendance data to JSON file
#         roll_number = self.face_roll_number_known_list[similar_person_num]
#         self.attendance(roll_number)
        
#         current_time = datetime.datetime.now().strftime('%H:%M:%S')
#         attendance_data = {'roll_number': roll_number, 'date': current_date, 'time': current_time}
#         with open('present_student.json', 'a') as json_file:
#             json.dump(attendance_data, json_file)
#             json_file.write('\n')

#         print(f"{roll_number} attendance saved to JSON file")

#         # Send attendance data to API
#         api_url = 'http://localhost:8080/attendance/set_attendance'
#         data = {'roll_number': roll_number, 'date': current_date, 'time': current_time}
#         response = requests.post(api_url, json=data)
#         if response.status_code == 200:
#             print(f"{roll_number} attendance saved to API")
#         else:
#             print(f"Failed to save {roll_number} attendance to API")

#     def run(self):
#         cap = cv2.VideoCapture(0)  # Get video stream from camera
#         self.process(cap)
#         cap.release()
#         cv2.destroyAllWindows()

# def main():
#     logging.basicConfig(level=logging.INFO)
#     Face_Recognizer_con = Face_Recognizer()
#     Face_Recognizer_con.run()

# if __name__ == '__main__':
#     main()


import json
import dlib
import numpy as np
import cv2
import os
import pandas as pd
import time
import logging
import sqlite3
import datetime
import requests

# Initialize Dlib components
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('data/data/data_dlib/shape_predictor_68_face_landmarks .dat')
face_reco_model = dlib.face_recognition_model_v1("data/data/data_dlib/dlib_face_recognition_resnet_model_v1 .dat")

# Initialize SQLite database
conn = sqlite3.connect("attendance.db")
cursor = conn.cursor()
cursor.execute("DROP TABLE IF EXISTS attendance")
create_table_sql = """
CREATE TABLE attendance (
    roll_number TEXT,
    time TEXT,
    date DATE,
    UNIQUE(roll_number, date)
)
"""
cursor.execute(create_table_sql)
conn.commit()
conn.close()

class FaceRecognizer:
    def __init__(self):
        self.font = cv2.FONT_ITALIC
        self.frame_time = 0
        self.frame_start_time = 0
        self.fps = 0
        self.fps_show = 0
        self.start_time = time.time()
        self.frame_cnt = 0

        self.face_features_known_list = []
        self.face_roll_number_known_list = []

        self.last_frame_face_centroid_list = []
        self.current_frame_face_centroid_list = []

        self.last_frame_face_roll_number_list = []
        self.current_frame_face_roll_number_list = []

        self.last_frame_face_cnt = 0
        self.current_frame_face_cnt = 0

        self.current_frame_face_X_e_distance_list = []

        self.current_frame_face_position_list = []
        self.current_frame_face_feature_list = []

        self.last_current_frame_centroid_e_distance = 0

        self.reclassify_interval_cnt = 0
        self.reclassify_interval = 10

    def get_face_database(self):
        if os.path.exists("data/features_all.csv"):
            csv_rd = pd.read_csv("data/features_all.csv", header=None)
            for i in range(csv_rd.shape[0]):
                features_someone_arr = []
                self.face_roll_number_known_list.append(csv_rd.iloc[i][0])
                for j in range(1, 129):
                    features_someone_arr.append(csv_rd.iloc[i][j] if csv_rd.iloc[i][j] != '' else '0')
                self.face_features_known_list.append(features_someone_arr)
            logging.info("Faces in Database: %d", len(self.face_features_known_list))
            return 1
        else:
            logging.warning("'features_all.csv' not found!")
            logging.warning("Please run 'get_faces_from_camera.py' and 'features_extraction_to_csv.py' before 'face_reco_from_camera.py'")
            return 0

    def update_fps(self):
        now = time.time()
        if int(self.start_time) != int(now):
            self.fps_show = self.fps
        self.start_time = now
        self.frame_time = now - self.frame_start_time
        self.fps = 1.0 / self.frame_time
        self.frame_start_time = now

    @staticmethod
    def return_euclidean_distance(feature_1, feature_2):
        return np.sqrt(np.sum(np.square(np.array(feature_1) - np.array(feature_2))))

    def centroid_tracker(self):
        for i in range(len(self.current_frame_face_centroid_list)):
            e_distance_current_frame_person_x_list = []
            for j in range(len(self.last_frame_face_centroid_list)):
                e_distance = self.return_euclidean_distance(self.current_frame_face_centroid_list[i], self.last_frame_face_centroid_list[j])
                e_distance_current_frame_person_x_list.append(e_distance)
            last_frame_num = e_distance_current_frame_person_x_list.index(min(e_distance_current_frame_person_x_list))
            self.current_frame_face_roll_number_list[i] = self.last_frame_face_roll_number_list[last_frame_num]

    def draw_note(self, img_rd):
        cv2.putText(img_rd, "Face Recognizer with Deep Learning", (20, 40), self.font, 1, (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(img_rd, "Frame:  " + str(self.frame_cnt), (20, 100), self.font, 0.8, (0, 255, 0), 1, cv2.LINE_AA)
        cv2.putText(img_rd, "FPS:    " + str(self.fps_show.__round__(2)), (20, 130), self.font, 0.8, (0, 255, 0), 1, cv2.LINE_AA)
        cv2.putText(img_rd, "Faces:  " + str(self.current_frame_face_cnt), (20, 160), self.font, 0.8, (0, 255, 0), 1, cv2.LINE_AA)
        cv2.putText(img_rd, "Q: Quit", (20, 450), self.font, 0.8, (255, 255, 255), 1, cv2.LINE_AA)

        for i in range(len(self.current_frame_face_roll_number_list)):
            roll_number_text = str(self.current_frame_face_roll_number_list[i])
            img_rd = cv2.putText(img_rd, "Face_" + str(i + 1), tuple([int(self.current_frame_face_centroid_list[i][0]), int(self.current_frame_face_centroid_list[i][1])]), self.font, 0.8, (255, 190, 0), 1, cv2.LINE_AA)
            img_rd = cv2.putText(img_rd, roll_number_text, tuple([int(self.current_frame_face_centroid_list[i][0]), int(self.current_frame_face_centroid_list[i][1]) + 20]), self.font, 0.8, (0, 255, 255), 1, cv2.LINE_AA)

    def attendance(self, roll_number):
        current_date = datetime.datetime.now().strftime('%Y-%m-%d')
        conn = sqlite3.connect("attendance.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM attendance WHERE roll_number = ? AND date = ?", (roll_number, current_date))
        existing_entry = cursor.fetchone()

        if existing_entry:
            print(f"{roll_number} is already marked as present for {current_date}")
        else:
            current_time = datetime.datetime.now().strftime('%H:%M:%S')
            cursor.execute("INSERT INTO attendance (roll_number, time, date) VALUES (?, ?, ?)", (roll_number, current_time, current_date))
            conn.commit()
            print(f"{roll_number} marked as present for {current_date} at {current_time}")

        conn.close()

    def process(self, stream):
        if self.get_face_database():
            while stream.isOpened():
                self.frame_cnt += 1
                flag, img_rd = stream.read()
                if not flag:
                    break
                kk = cv2.waitKey(1)
                faces = detector(img_rd, 0)

                self.last_frame_face_cnt = self.current_frame_face_cnt
                self.current_frame_face_cnt = len(faces)

                self.last_frame_face_roll_number_list = self.current_frame_face_roll_number_list[:]
                self.last_frame_face_centroid_list = self.current_frame_face_centroid_list
                self.current_frame_face_centroid_list = []

                if (self.current_frame_face_cnt == self.last_frame_face_cnt) and (self.reclassify_interval_cnt != self.reclassify_interval):
                    self.current_frame_face_position_list = []
                    if "unknown" in self.current_frame_face_roll_number_list:
                        self.reclassify_interval_cnt += 1
                    if self.current_frame_face_cnt != 0:
                        for k, d in enumerate(faces):
                            self.current_frame_face_position_list.append(tuple([d.left(), int(d.bottom() + (d.bottom() - d.top()) / 4)]))
                            self.current_frame_face_centroid_list.append([int(d.left() + d.right()) / 2, int(d.top() + d.bottom()) / 2])
                            cv2.rectangle(img_rd, (d.left(), d.top()), (d.right(), d.bottom()), (255, 255, 255), 2)
                        if self.current_frame_face_cnt != 1:
                            self.centroid_tracker()
                        for i in range(self.current_frame_face_cnt):
                            roll_number_text = str(self.current_frame_face_roll_number_list[i])
                            cv2.putText(img_rd, roll_number_text, self.current_frame_face_position_list[i], self.font, 0.8, (0, 255, 255), 1, cv2.LINE_AA)
                    self.draw_note(img_rd)
                else:
                    self.current_frame_face_position_list = []
                    self.current_frame_face_X_e_distance_list = []
                    self.current_frame_face_feature_list = []
                    self.reclassify_interval_cnt = 0
                    if self.current_frame_face_cnt == 0:
                        self.current_frame_face_roll_number_list = []
                    else:
                        self.current_frame_face_roll_number_list = []
                        for i in range(len(faces)):
                            shape = predictor(img_rd, faces[i])
                            self.current_frame_face_feature_list.append(face_reco_model.compute_face_descriptor(img_rd, shape))
                        for k in range(len(faces)):
                            self.current_frame_face_centroid_list.append([int(faces[k].left() + faces[k].right()) / 2, int(faces[k].top() + faces[k].bottom()) / 2])
                            self.current_frame_face_roll_number_list.append("unknown")
                            self.current_frame_face_position_list.append(tuple([faces[k].left(), int(faces[k].bottom() + (faces[k].bottom() - faces[k].top()) / 4)]))
                            for i in range(len(self.face_features_known_list)):
                                if str(self.face_features_known_list[i][0]) != '0.0':
                                    e_distance_tmp = self.return_euclidean_distance(self.current_frame_face_feature_list[k], self.face_features_known_list[i])
                                    self.current_frame_face_X_e_distance_list.append(e_distance_tmp)
                                else:
                                    self.current_frame_face_X_e_distance_list.append(999999999)
                            similar_person_num = self.current_frame_face_X_e_distance_list.index(min(self.current_frame_face_X_e_distance_list))
                            if min(self.current_frame_face_X_e_distance_list) < 0.4:
                                self.current_frame_face_roll_number_list[k] = self.face_roll_number_known_list[similar_person_num]
                                roll_number = self.face_roll_number_known_list[similar_person_num]
                                self.attendance(roll_number)
                            else:
                                logging.debug("Face recognition result: Unknown person")
                        self.draw_note(img_rd)
                if kk == ord('q'):
                    break
                self.update_fps()
                cv2.namedWindow("camera", 1)
                cv2.imshow("camera", img_rd)
                logging.debug("Frame ends\n\n")

        current_time = datetime.datetime.now().strftime('%H:%M:%S')
        current_date = datetime.datetime.now().strftime('%Y-%m-%d')
        roll_number = self.face_roll_number_known_list[similar_person_num]
        attendance_data = {'roll_number': roll_number, 'date': current_date, 'time': current_time}
        with open('present_student.json', 'a') as json_file:
            json.dump(attendance_data, json_file)
            json_file.write('\n')
        print(f"{roll_number} attendance saved to JSON file")

        api_url = 'http://localhost:8080/admin/attendance/set_attendance'
        data = {'roll_number': roll_number, 'date': current_date, 'status': "active"}
        response = requests.post(api_url, json=data)
        if response.status_code == 200:
            print(f"{roll_number} attendance saved to API")
        else:
            print(f"Failed to save {roll_number} attendance to API")

    def run(self):
        cap = cv2.VideoCapture(0)  # Get video stream from camera
        self.process(cap)
        cap.release()
        cv2.destroyAllWindows()

def main():
    logging.basicConfig(level=logging.INFO)
    FaceRecognizer_con = FaceRecognizer()
    FaceRecognizer_con.run()

if __name__ == '__main__':
    main()
