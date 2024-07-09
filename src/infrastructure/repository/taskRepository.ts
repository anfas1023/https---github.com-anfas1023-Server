import { ITaskRepository } from "../../application/interface/ITaskRepository";
import Task from "../database/model/taskModel";
import { Workspace } from "../database/model/workspacemodel";

export class TaskRepository implements ITaskRepository {
  async createTask(
    progressionName: string,
    taskName: string,
    assignee: string[],
    startDate: string,
    endDate: string,
    status: string,
    priority: string,
    owner_id: string,
    workspaceId: string,
    boardId: string,
    folderId: string,
    description:string,
    randomId:string
  ) {
    // console.log("here", owner_id, assignee);

    const taskData = {
      taskName,
      assignee: assignee,
      startDate,
      endDate,
      status,
      priority,
      owner_id,
      workspaceId,
      boardId,
      folderId,
      description,
      randomId
    };

    const newTask = new Task(taskData);
    await newTask.save();
    return newTask;
  }

  async findTaskOfUser(
    workspaceId: string,
    folderId: string,
    boardId: string,
    email: string,
    userId:string
  ) {
    console.log("workspaceId",workspaceId,folderId,boardId,email); 

    const assignedTasks = await Task.find({
      workspaceId: workspaceId,
      folderId: folderId,
      boardId: boardId,
      assignee: { $elemMatch: { email: email } },
    });

    console.log("assignedTasks",assignedTasks);
    
    

    // return assignedTask
    if(assignedTasks.length!==0){
      // console.log("assignedTask",assignedTask);
      
      return assignedTasks
    }

    
    const OwnerTask = await Task.find({
      workspaceId: workspaceId,
      folderId: folderId,
      boardId: boardId,
      owner_id:userId,
    }); 
    // console.log("1");
    
    if(OwnerTask){
      console.log("OwnerTask",OwnerTask);
      return OwnerTask
    }else{
      return null
    }
  }

  // async findUserAndAssignTask(query:string){
  //   const searchedResult = await Workspace.find({
  //     inviteMembers: {
  //       $elemMatch: {
  //         $regex: query,
  //         $options: "i",
  //       },
  //     },
  //   });

  //   return searchedResult
  // }

  async addAttachements(file:any,taskId:string){
    console.log("file",file.originalname,file.location);
    const data={attachment:file.location,originalName:file.originalname }
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $push: { attachments: data } },
      { new: true }
    );

  return updatedTask;
  }



  async findTaskAndAddDescription(description:string,taskId:string) {
   const addDescription =await Task.findByIdAndUpdate(taskId,{
    $set:{
      description:description
    }
   },{new:true});

   return addDescription
  }


  async addComment(taskId: string, senderId: string, comment: string) {
    const newComment = { senderId, comment };
  const adddedComent=  await Task.findByIdAndUpdate(
      taskId,
      { $push: { comments: newComment } },
      { new: true, useFindAndModify: false }
    );

    return adddedComent
  }

}
