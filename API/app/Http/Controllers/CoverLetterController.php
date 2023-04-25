<?php

namespace App\Http\Controllers;

use App\Models\CoverLetter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CoverLetterController extends Controller
{
    public function coverLetter(Request $request){
        $cover_letter = DB::table('cover_letters')->where('candidate_id', Auth::id())->get();
        if(count($cover_letter) <= 0){
            $data = [
                'letter' => $request->input("letter"),
                'candidate_id' => $request->input("id"),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            CoverLetter::insert($data);
        }else{
            foreach($cover_letter as $item){
                CoverLetter::updateOrCreate(
                    ['id' => $item->id],
                    ['letter' => $request->input("letter")],
                    ['updated_at' => date('Y-m-d H:i:s')],
                );
            }
        }
        return response()->json([
            'message' => 'Les données sont bien sauvegardés',
        ]);
    }
    public function getCoverLetter(){
        $cover_letter = DB::table('cover_letters')->where('candidate_id', Auth::id())->first();
        return response()->json([
            'letter'=> $cover_letter
        ]);
    }
}
