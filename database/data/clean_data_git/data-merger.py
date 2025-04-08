import pandas as pd
import numpy as np
import os

csv_files = [file for file in os.listdir("database/data/data_git/") if file.endswith(".csv")]

df_list = [pd.read_csv(os.path.join("database/data/data_git/", file)) for file in csv_files]
merged_df = pd.concat(df_list, ignore_index=True)
merged_df.to_csv("database/data/clean_data_git/git_data_merged.csv", index=False)